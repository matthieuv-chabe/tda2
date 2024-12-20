import { ExtrapolFromLocAndTime } from "../CarLocationExtrapol";
import { Root } from "../waynium";
import { ClientInfo, LastReceivedLocationInfo, LocationInfo, MissionInfo } from "./types";
import { mstohuman } from "./utils";

export class CarLocationManagerC {
    public first_dispatch: string = ""
    private clients: ClientInfo[] = [];
    public missions: MissionInfo[] = [];
    public locations: LocationInfo[] = [];
    public lastReceivedLocation: LastReceivedLocationInfo[] = [];
    public lastRefresh = new Date();
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

    public async Initialize(clients: ClientInfo[]) {
        if (clients.length !== 0) {
            this.clients = clients;
        } else {
            console.error("CarLocationManager: No clients provided");
        }

        this.Refresh(true);
    }

    public GetLocation(missionId: string) {
        const location = this.locations.find(l => l.missionId === missionId);
        if (location) {
            return location.location;
        } else {
            return null;
        }
    }

    public GetLastReceivedLocation(missionId: string) {
        const location = this.lastReceivedLocation.find(l => l.missionId === missionId);
        if (location) {
            return location;
        } else {
            return null;
        }
    }

    public async Refresh(force = false) {
        if (!force && new Date().getTime() - this.lastRefresh.getTime() < 1000 * 10) {
            console.log("CarLocationManager: Refreshing too fast, skipping");
            return;
        }

        this.lastRefresh = new Date();

        this._mergeMissions(await this._getMissions())
        this._cleanMissions();

        console.log("CarLocationManager =======================================")
        console.log("Total missions", this.missions.length);
        console.log("CarLocationManager =======================================")


        console.log("Remaining missions", this.missions.length);

        for (const mission of this.missions) {
            try {
                mission.debug = "yoX"

                if (mission.w.MIS_DATE_DEBUT == null || mission.w.MIS_HEURE_DEBUT == null) {
                    mission.information = "missingdate";
                    continue;
                }

                const startdate = new Date(mission.w.MIS_DATE_DEBUT + "T" + mission.w.MIS_HEURE_DEBUT);
                const now = new Date();

                const start_in_minutes = Math.floor((startdate.getTime() - now.getTime()) / 1000 / 60);

                if (start_in_minutes >= 0) {
                    mission.information = "VMission à venir";
                    continue;
                }

                console.log("Processing mission", mission.w.MIS_ID, "in", start_in_minutes, "minutes");
                console.log("Chauffeur=" + (mission.w.C_Gen_Chauffeur?.CHU_NOM || "N/A"))

                await this._update_geolocation_information(mission);
            } catch (e) {
                console.error("CarLocationManager: Error while processing mission", mission.w.MIS_ID);
            }
        }
    }

    private async _getMissions(): Promise<MissionInfo[]> {
        const req = this?.clients.map(c => `${c.limo}_${c.name}`).join(",");
        const res = await fetch(`https://rct.tda2.chabe.com/api/missions/clients/${req}`);
        const data = await res.json() as Root[];

        this.first_dispatch = this?.clients[0]?.limo || ""

        return data.map((d) => ({
            w: d,
            acc: (d.MIS_TSE_ID == "12" || d.MIS_TSE_ID == "51"),
            mad: (d.MIS_TSE_ID == "3" || d.MIS_TSE_ID == "22" || d.MIS_TSE_ID == "54"),
        } as MissionInfo));
    }

    private async _mergeMissions(missions: MissionInfo[]) {
        const newlist = missions;
        const oldlist = this.missions;

        const newlist2 = newlist.map(m => {
            const old = oldlist.find(o => o.w.MIS_ID === m.w.MIS_ID);

            if (!old) return m;

            return {
                ...m,
                information: old.information,
                refresh_after: old.refresh_after,
                cache_polylines: old.cache_polylines,
                debug: old.debug,
                do_not_compute: old.do_not_compute || false,
            }
        })

        this.missions = newlist2;
    }

    private async _update_geolocation_information(mission: MissionInfo) {
        if (mission.do_not_compute) {
            mission.debug = "do_not_compute";
            return;
        }

        if (mission.acc) {
            mission.information = "Accueil";
            return;
        }

        console.log("CLM - Update geoloc for mission", mission.w.MIS_ID);

        const mission_id = mission.w.MIS_ID;
        const location = this.locations.find(l => l.missionId === mission_id);

        mission.debug = "yo"

        if (mission.information == "") {
            mission.information = "!Aucune donnée de géolocalisation";
        }

        if (JSON.stringify(mission.w.C_Gen_EtapePresence).indexOf("%DIC_LIEU_A_DEFINIR%") !== -1) {
            mission.information = "Lieu d'arrivée non défini";
        }

        if (new Date() < mission.refresh_after) {
            mission.information += "!"
            return;
        }

        const res = await fetch(`https://rct.tda2.chabe.com/api/getProbableLocationForMission/${mission.w.MIS_ID}/date/a`);
        const data = await res.json() as Geo;

        mission.debug = "testX"

        if (data.result.length == 0) {
            if (mission.mad) {
                mission.information = "Transport - Pas de géolocalisation";
                return;
            }

            const startplace = mission.w.C_Gen_EtapePresence[0].C_Geo_Lieu;
            const endplace = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;

            if (!startplace || !endplace || !startplace.LIE_LAT || !startplace.LIE_LNG || !endplace.LIE_LAT || !endplace.LIE_LNG) {
                mission.information = "notenoughdata";
                mission.debug = "notenoughdata";
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

                mission.information = extp.polylines.length > 1
                    ? "Extrapolation complète"
                    : "?"

                const error_zero = JSON.stringify(extp).includes("ZERO_RESULTS");
                if (error_zero) {
                    mission.information = "Chemin impossible";
                    return;
                }

                mission.cache_polylines = extp.polylines;
                mission.debug = "extrapolated<br />";

                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    location: {
                        lng: extp.loc_within_poly.pos.lng,
                        lat: extp.loc_within_poly.pos.lat
                    }
                });

            } catch (e) {
                console.error("CarLocationManager: Error while extrapolating", e);
                mission.information = "Itinéraire vers arrivée inconnu";
                mission.debug = "err^=" + e.message;
            }
        } else {
            this.lastReceivedLocation = this.lastReceivedLocation.filter(l => l.missionId !== mission.w.MIS_ID);
            this.lastReceivedLocation.push({
                missionId: mission.w.MIS_ID,
                lng: data.probable_location.location.lon,
                lat: data.probable_location.location.lat,
                time: new Date(data.probable_location.candidates[0].date)
            })

            if (mission.mad) {
                mission.information = "VTransport - Dernière géolocalisation à " + new Date(data.probable_location.candidates[0].date).toLocaleTimeString();
                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    location: {
                        lng: data.probable_location.location.lon,
                        lat: data.probable_location.location.lat
                    }
                });
                return;
            }

            mission.debug += "data from elastic<br />"

            const p = data.probable_location.location;
            const time = new Date(data.probable_location.candidates[0].date);
            const now = new Date();

            mission.debug = mission.w.MIS_ID + " elastic last date time: " + time.toLocaleTimeString() + "<br />";

            const startplace = mission.w.C_Gen_EtapePresence[0].C_Geo_Lieu;
            const endplace = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;
            if (startplace.LIE_LAT == endplace.LIE_LAT && startplace.LIE_LNG == endplace.LIE_LNG) {
                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    lastRealData: time,
                    location: {
                        lng: p.lon,
                        lat: p.lat
                    }
                });

                mission.information = "Itinéraire vers arrivée inconnu."

                return;
            };

            const young_enough_no_need_extrapolate = (now.getTime() - time.getTime()) < 5 * 60 * 1000;

            if (!young_enough_no_need_extrapolate) {
                mission.information = "Calcul de la position extrapolée...";

                const last_known_location = data.probable_location.location;
                const last_known_time = new Date(data.probable_location.candidates[0].date);

                const arr = mission.w.C_Gen_EtapePresence[mission.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu;
                const arr_loc = {
                    lat: parseFloat(arr.LIE_LAT),
                    lng: parseFloat(arr.LIE_LNG)
                }

                const lines = await ExtrapolFromLocAndTime(
                    { lat: last_known_location.lat, lng: last_known_location.lon },
                    arr_loc,
                    last_known_time
                )

                const error_zero = JSON.stringify(lines).includes("ZERO_RESULTS");
                if (error_zero) {
                    mission.information = "!Chemin impossible";
                    return;
                }

                mission.cache_polylines = lines.polylines;
                mission.information = "?Extrapolé (dernière position il y a " + mstohuman(new Date().getTime() - last_known_time.getTime()) + ")";
                mission.debug = "geoloc time=" + last_known_time.toLocaleTimeString() + "<br />";

                const loc_within_poly = lines.loc_within_poly;

                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    location: {
                        lng: loc_within_poly.pos.lng,
                        lat: loc_within_poly.pos.lat
                    }
                });

            } else {
                console.log("good")
                mission.information = "VPosition à jour (" + time.toLocaleTimeString() + ")";
                this.locations = this.locations.filter(l => l.missionId !== mission.w.MIS_ID);
                this.locations.push({
                    missionId: mission.w.MIS_ID,
                    lastRefresh: new Date(),
                    lastRealData: new Date(time),
                    location: {
                        lng: p.lon,
                        lat: p.lat
                    }
                });
            }
        }
    }

    public _cleanMissions() {
        const num_missions = this.missions.length + 0;

        this.missions = this.missions
            .filter(m => {
                const startdate = new Date(m.w.MIS_DATE_DEBUT + "T" + m.w.MIS_HEURE_DEBUT);
                const now = new Date();
                return Math.floor((startdate.getTime() - now.getTime()) / 1000 / 60) < 20;
            });

        this.missions.forEach(m => {
            if (m.w.MIS_DATE_DEBUT == null || m.w.MIS_HEURE_DEBUT == null) {
                m.do_not_compute = true;
            }
        });

        this.missions.forEach(m => {
            const enddate = new Date(m.w.MIS_DATE_DEBUT + "T" + m.w.MIS_HEURE_FIN);
            const now = new Date();
            if (Math.floor((now.getTime() - enddate.getTime()) / 1000 / 60) > 60) {
                m.debug = "ended";
                m.do_not_compute = true;
            }
        })

        this.missions = this.missions
            .filter(m => m.w.MIS_SMI_ID !== "7")
            .filter(m => m.w.MIS_SMI_ID !== "13")
            .filter(m => m.w.MIS_SMI_ID !== "21")

        this.missions = this.missions.filter(m => m.w.MIS_ETAT == "1");

        this.missions.forEach(m => {
            if (m.w.MIS_HEURE_REEL_FIN != null) {
                m.do_not_compute = true;
            }
        });

        this.missions.forEach(m => {
            m.w.C_Gen_EtapePresence = m.w.C_Gen_EtapePresence.sort((a, b) => a.EPR_TRI - b.EPR_TRI);
        })

        console.log("CarLocationManager: Cleaned", num_missions - this.missions.length, "missions");
    }
}

export const CarLocationManager = new CarLocationManagerC();
