import { Geo } from "./Geoloc";
import { getPolylinesWithTimes, getPositionFromElapsedTime } from "./GMapsQ";
import { Root } from "./waynium";

import * as fs from 'fs';

type ClientInfo = {
    name: string;
    limo: string;
}

type MissionInfo = {
    w: Root; // Waynium information
    information: string; // Some additional data that might be useful
}

class CarLocationManagerC {


    private clients: ClientInfo[] = [];
    private missions: MissionInfo[] = [];
    private locations: {
        missionId: string;
        lastRefresh: Date;
        lastRealData?: Date;
        location: { lng: number, lat: number };
    }[] = []
    private gmapsCache: {
        missionId: string;
        gmaps: any;
    }[] = []

    public Initialize(clients: ClientInfo[]) {
        if(clients.length !== 0) {
            this.clients = clients;
        } else {
            console.error("CarLocationManager: No clients provided");
        }
    }

    private async _getMissions(): Promise<MissionInfo[]> {
        // https://rct.tda2.chabe.com/api/missions/clients/1586,chabe_409,chabe_872,chabe_266,chabe_1748,chabe_770,chabe_470,chabe_1278,chabe_2762,chabe_686,chabe_759,chabedev_626,chabe_1413
        const req = this?.clients.map(c => `${c.limo}_${c.name}`).join(",");
        const res = await fetch(`https://rct.tda2.chabe.com/api/missions/clients/${req}`);
        const data = await res.json();
        return data.map((d: any) => ({w:d}));
    }

    private async _matchMissions(missions: MissionInfo[]) {
        // We have missions in this.missions
        // And we have missions in the parameter
        // We need to update this.missions with the new missions if there is new data

        console.log("CarLocationManager: Matching missions");
        console.log("CarLocationManager: Old missions", this.missions.length);
        console.log("CarLocationManager: New missions", missions.length);

        // Updating old ones :

    }

    private async _update_geolocation_information(mission: MissionInfo) {

        const mission_id = mission.w.MIS_ID;
        const location = this.locations.find(l => l.missionId === mission_id);

        // If a location has been found and it has been updated less than 3 minutes ago,
        //  we don't need to update it
        if(location && location.lastRefresh.getTime() - new Date().getTime() < 3 * 60 * 1000) {
            // console.log("Location already updated for mission", mission_id);
            return;
        }

        // https://rct.tda2.chabe.com/api/getProbableLocationForMission/290506/date/a
        const res = await fetch(`https://rct.tda2.chabe.com/api/getProbableLocationForMission/${mission.w.MIS_ID}/date/a`);
        const data = await res.json() as Geo;

        if(data.result.length == 0) {
            const startplace = mission.w.C_Gen_EtapePresence[0].C_Geo_Lieu;
            const endplace = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;

            // console.log("No data found for mission", mission.w.MIS_ID);
            // console.log("Startplace", startplace.LIE_LAT, startplace.LIE_LNG);
            // console.log("Endplace", endplace.LIE_LAT, endplace.LIE_LNG);

            if(!startplace || !endplace || !startplace.LIE_LAT || !startplace.LIE_LNG || !endplace.LIE_LAT || !endplace.LIE_LNG) {
                // console.error("CarLocationManager: Missing data for mission", mission.w.MIS_ID);
                return;
            }

            try {
                const polylines = await getPolylinesWithTimes(
                    "AIzaSyDy00hN3E5T624ncCFNvbzAqROGoXcpmuk",
                    `${startplace.LIE_LAT},${startplace.LIE_LNG}`,
                    `${endplace.LIE_LAT},${endplace.LIE_LNG}`,
                    new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT)
                )

                const loc_within_poly = getPositionFromElapsedTime(
                    polylines,
                    new Date().getTime() - new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT).getTime()
                )

            } catch (e) {
                if(e.message.indexOf("ZERO_RESULTS") !== -1) {
                    this.missions
                        .filter(m => m.w.MIS_ID === mission.w.MIS_ID)
                        .forEach(m => {
                            m.information = "ZERO_RESULTS";
                            console.log("CarLocationManager: No route found for mission", mission.w.MIS_ID);
                        });
                }
            }

        } else {
            // Get the latest and best information
            const p = data.probable_location.location;
            const right_candidate = data.result.find(r => r._source.location.lat == p.lat && r._source.location.lon == p.lon)!;
            const time = new Date(right_candidate._source.date);
            const now = new Date();

            // If time > 3 min, we need to extrapolate it
            const younger_than_3min = now.getTime() - time.getTime() < 3 * 60 * 1000;

            // That might indicate a bug from the Tracker, matching the mission with the wrong data
            // const geoloc_data_is_younger_than_mission_start = time.getTime() > new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT).getTime();

            if( !younger_than_3min ) {

                // TODO 1
                console.log("extrapolate, because time is too old (", Math.floor((now.getTime() - time.getTime())/1000/60), "minutes)")
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

    public async GetLocation(missionId: string) {
        const location = this.locations.find(l => l.missionId === missionId);
        if(location) {
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

        // Remove missions that are Accueils
        this.missions = this.missions.filter(m => m.w.C_Com_TypeService.TSE_ID !== "12");
        this.missions = this.missions.filter(m => m.w.C_Com_TypeService.TSE_ID !== "3");

        // Remove missions that are cancelled (status = 4)
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "4");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "13");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "21");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "7");
        this.missions = this.missions.filter(m => m.w.MIS_SMI_ID !== "8");


        // Remove missions that are deleted
        this.missions = this.missions.filter(m => m.w.MIS_ETAT == "1");

        // Remove missions that are completed
        this.missions = this.missions.filter(m => m.w.MIS_HEURE_REEL_FIN == null);

        console.log("CarLocationManager: Cleaned", num_missions - this.missions.length, "missions");

    }

    public async Refresh() {


        this.missions = (await this._getMissions()) as MissionInfo[];
        this._cleanMissions();

        console.log("Remaining missions", this.missions.length);
        fs.writeFileSync("missions.json", JSON.stringify(this.missions, null, 4));
    
        for(let i = 0; i < this.missions.length; i++) {

            if(this.missions[i].w.MIS_DATE_DEBUT == null || this.missions[i].w.MIS_HEURE_DEBUT == null) continue;

            const startdate = new Date(this.missions[i].w.MIS_DATE_DEBUT + "T" + this.missions[i].w.MIS_HEURE_DEBUT);
            const now = new Date();


            const start_in_minutes = Math.floor((startdate.getTime() - now.getTime()) / 1000 / 60);
            // Here start_in_minutes is the number of minutes before the mission starts
            // If start_in_minutes is negative, the mission has already started for -1 * start_in_minutes minutes

            if(
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

CarLocationManager.Initialize([{
    limo:'chabe',
    name: '409'
}, {
    limo: 'chabe',
    name: '872'
},
{
    limo: 'chabe',
    name: '266'
},
{
    limo: 'chabe',
    name: '1748'
},
{
    limo: 'chabe',
    name: '770'
},
{
    limo: 'chabe',
    name: '470'
},
{
    limo: 'chabe',
    name: '1278'
},
{
    limo: 'chabe',
    name: '2762'
},
{
    limo: 'chabe',
    name: '686'
},
{
    limo: 'chabe',
    name: '759'
},
{
    limo: 'chabe',
    name: '141',
}])

await CarLocationManager.Refresh();
