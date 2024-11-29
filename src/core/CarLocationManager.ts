import { ExtrapolFromLocAndTime } from "./CarLocationExtrapol";
import { Geo } from "./Geoloc";
import { Root } from "./waynium";

const addtodate = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60 * 1000);

type ClientInfo = {
    name: string;
    limo: string;
}

export type MissionInfo = {
    w: Root; // Waynium information
    acc: boolean; // Is it an accueil?
    information: string; // Some additional data that might be useful 
    refresh_after: Date; // When to refresh the data
}

export class CarLocationManagerC {

    private stop = true;

    public start() {
        this.stop = false;
        this.startNoStack.bind(this)();
    }

    public destroy() {
        this.stop = true;
    }

    private startNoStack() {
        if (this.stop) return;
        setTimeout(() => {
            this.Refresh.bind(this)().then(() => {
                this.startNoStack.bind(this)();
            });
        }, 1000);
    }


    private clients: ClientInfo[] = [];
    public missions: MissionInfo[] = [];
    public locations: {
        missionId: string;
        lastRefresh: Date;
        lastRealData?: Date;
        location: { lng: number, lat: number };
    }[] = []
    private gmapsCache: {
        missionId: string;
        gmaps: any;
    }[] = []

    public async Initialize(clients: ClientInfo[]) {
        if (clients.length !== 0) {
            this.clients = clients;
        } else {
            console.error("CarLocationManager: No clients provided");
        }

        this._mergeMissions(await this._getMissions());
        this._cleanMissions();
    }

    private async _getMissions(): Promise<MissionInfo[]> {

        debugger;

        // https://rct.tda2.chabe.com/api/missions/clients/1586,chabe_409,chabe_872,chabe_266,chabe_1748,chabe_770,chabe_470,chabe_1278,chabe_2762,chabe_686,chabe_759,chabedev_626,chabe_1413
        const req = this?.clients.map(c => `${c.limo}_${c.name}`).join(",");
        const res = await fetch(`https://rct.tda2.chabe.com/api/missions/clients/${req}`);
        const data = await res.json() as Root[];
        return data.map((d) => ({
            w: d,
            acc: (d.MIS_TSE_ID == "12" || d.MIS_TSE_ID == "51"),
        } as MissionInfo));
    }

    private async _mergeMissions(missions: MissionInfo[]) {
        const newlist = missions;
        const oldlist = this.missions;

        oldlist.forEach(old => {

            let n = newlist.find(n => n.w.MIS_ID === old.w.MIS_ID);
            if (!n) {
                newlist.push(old);
                n = old;
            }

            n.information = old.information;
        });

        this.missions = newlist;

    }

    private async _update_geolocation_information(mission: MissionInfo) {

        console.log("CLM - Update geoloc for mission", mission.w.MIS_ID);

        const mission_id = mission.w.MIS_ID;
        const location = this.locations.find(l => l.missionId === mission_id);

        if(mission.refresh_after && new Date() < mission.refresh_after) {
            // console.log("CarLocationManager: Refreshing in", Math.floor((mission.refresh_after.getTime() - new Date().getTime()) / 1000 / 60), "minutes");
            mission.information += "!"
            return;
        }

        // If a location has been found and it has been updated less than 3 minutes ago,
        //  we don't need to update it
        if (location && location.lastRefresh.getTime() - new Date().getTime() < 3 * 60 * 1000) {
            // console.log("Location already updated for mission", mission_id);
            this.missions.find(m => m.w.MIS_ID === mission_id)!.information += "?";
            return;
        }

        // https://rct.tda2.chabe.com/api/getProbableLocationForMission/290506/date/a
        const res = await fetch(`https://rct.tda2.chabe.com/api/getProbableLocationForMission/${mission.w.MIS_ID}/date/a`);
        const data = await res.json() as Geo;

        if (data.result.length == 0) {
            const startplace = mission.w.C_Gen_EtapePresence[0].C_Geo_Lieu;
            const endplace = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;

            if (!startplace || !endplace || !startplace.LIE_LAT || !startplace.LIE_LNG || !endplace.LIE_LAT || !endplace.LIE_LNG) {
                // console.error("CarLocationManager: Missing data for mission", mission.w.MIS_ID);
                this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!.information = "notenoughdata";
                return;
            }

            this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!.information = "NODATA-YET";
            const startdate = new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT);

            try {
                const extp = await ExtrapolFromLocAndTime(
                    { lat: Number.parseFloat(startplace.LIE_LAT), lng: Number.parseFloat(startplace.LIE_LNG) },
                    { lat: Number.parseFloat(endplace.LIE_LAT), lng: Number.parseFloat(endplace.LIE_LNG) },
                    startdate
                )

                this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!.information = extp.polylines.length > 1
                    ? ""//"extrapolated-multiplepoints"
                    : "?"

                const error_zero = JSON.stringify(extp).includes("ZERO_RESULTS");
                if (error_zero) {
                    const m = this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!
                    
                    m.information = "Chemin impossible";
                    m.refresh_after = addtodate(new Date(), 10);
                    return;
                }


            } catch (e) {
                console.error("CarLocationManager: Error while extrapolating", e);
                this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!.information = "err^=" + e.message;
            }



        } else {
            // Get the latest and best information
            const p = data.probable_location.location;
            const right_candidate = data.result.find(r => r._source.location.lat == p.lat && r._source.location.lon == p.lon)!;
            const time = new Date(right_candidate._source.date);
            const now = new Date();

            // If start and end are the same, we don't need to update the location, just keep the best one
            const startplace = mission.w.C_Gen_EtapePresence[0].C_Geo_Lieu;
            const endplace = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;
            if (startplace.LIE_LAT == endplace.LIE_LAT && startplace.LIE_LNG == endplace.LIE_LNG) {
                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    lastRealData: new Date(right_candidate._source.date),
                    location: {
                        lng: p.lon,
                        lat: p.lat
                    }
                });
                return;
            };

            // If time > 3 min, we need to extrapolate it
            const younger_than_3min = now.getTime() - time.getTime() < 3 * 60 * 1000;

            // That might indicate a bug from the Tracker, matching the mission with the wrong data
            // const geoloc_data_is_younger_than_mission_start = time.getTime() > new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT).getTime();

            if (!younger_than_3min) {

                this.missions.find(m => m.w.MIS_ID === mission.w.MIS_ID)!.information = "NEEDSEXTRAPOLATION";

            } else {
                console.log("good")
                // We have the correct information
                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    lastRealData: new Date(right_candidate._source.date),
                    location: {
                        lng: p.lon,
                        lat: p.lat
                    }
                });
            }
        }
    }

    public GetLocation(missionId: string) {
        const location = this.locations.find(l => l.missionId === missionId);
        if (location) {
            return location.location;
        } else {
            return null;
        }
    }

    public _cleanMissions() {

        const num_missions = this.missions.length + 0;

        // Filter those starting in more than 20 min
        this.missions = this.missions
            .filter(m => {
                const startdate = new Date(m.w.MIS_DATE_DEBUT + "T" + m.w.MIS_HEURE_DEBUT);
                const now = new Date();
                return Math.floor((startdate.getTime() - now.getTime()) / 1000 / 60) < 20;
            });

        // Filter incomplete
        this.missions = this.missions
            .filter(m => m.w.MIS_DATE_DEBUT != null && m.w.MIS_HEURE_DEBUT != null);

        // Remove missions that are cancelled (status = 4)
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "4");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "13");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "21");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "7");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "8");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "16"); // Annulé
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "21"); // Annulé


        // Remove missions that are deleted
        this.missions = this.missions.filter(m => m.w.MIS_ETAT == "1");

        // Remove missions that are completed
        this.missions = this.missions.filter(m => m.w.MIS_HEURE_REEL_FIN == null);

        console.log("CarLocationManager: Cleaned", num_missions - this.missions.length, "missions");

    }

    public lastRefresh = new Date();
    public async Refresh() {

        if(new Date().getTime() - this.lastRefresh.getTime() < 1000 * 10) {
            console.log("CarLocationManager: Refreshing too fast, skipping");
            return;
        }

        this.lastRefresh = new Date();


        this.missions = (await this._getMissions()) as MissionInfo[];
        this._cleanMissions();

        console.log("CarLocationManager =======================================")
        console.log("Total missions", this.missions.length);
        console.log("CarLocationManager =======================================")


        console.log("Remaining missions", this.missions.length);
        // fs.writeFileSync("missions.json", JSON.stringify(this.missions, null, 4));

        for (let i = 0; i < this.missions.length; i++) {

            if (this.missions[i].w.MIS_DATE_DEBUT == null || this.missions[i].w.MIS_HEURE_DEBUT == null) continue;

            const startdate = new Date(this.missions[i].w.MIS_DATE_DEBUT + "T" + this.missions[i].w.MIS_HEURE_DEBUT);
            const now = new Date();


            const start_in_minutes = Math.floor((startdate.getTime() - now.getTime()) / 1000 / 60);
            // Here start_in_minutes is the number of minutes before the mission starts
            // If start_in_minutes is negative, the mission has already started for -1 * start_in_minutes minutes

            if (
                start_in_minutes >= 0 // Not yet started
            ) continue;

            console.log("Processing mission", this.missions[i].w.MIS_ID, "in", start_in_minutes, "minutes");
            console.log("Chauffeur=" + (this.missions[i].w.C_Gen_Chauffeur?.CHU_NOM || "N/A"))

            const mission = this.missions[i];
            await this._update_geolocation_information(mission);
        }
    }

}

export const CarLocationManager = new CarLocationManagerC();
