
import { paths } from "../../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../../generated/openapi_geolocation"
import * as fns from "date-fns"

type missionT = paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number]
type geolocationT = geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]

export const Explanation = (props: {
    mission: missionT,
    geolocation?: geolocationT
}) => {

    if(props.mission.locations.filter(m => m.name != "").length < 2) {
        return <p style={{ color: 'orange' }}>
            Lieux non définis, suivi impossible.
        </p>
    }

    if (!props.geolocation) {
        return <p style={{ color: 'grey' }}>
            Nous n'avons pas d'information sur cette mission.
        </p>
    }

    const geolocdate = new Date(props.geolocation.geolocation?.timestamp)
        if(!props.geolocation.geolocation || !geolocdate) {
            return <p style={{ color: 'orange' }}>
                Extrapolation complète
            </p>
        } else if (fns.differenceInMinutes(new Date(), geolocdate) > 5) {
            return <p style={{ color: 'orange' }}>
                Dernière position connue il y a {fns.differenceInMinutes(new Date(), geolocdate)} minutes
            </p>
        } else {
            return <p style={{ color: 'green' }}>
                Mission à jour
            </p>
        }

    // If the chauffeur did NOT click on POB, and the mission is not planned to start yet, then it probably means it didn't start.
    if (
        !props.geolocation?.mission.chauffeur_clicked_pob_at
        && props.mission.status < 8
    ) {
        if (props.mission.date && props.mission.startTime) {

            // @ts-expect-error We know it's a string.
            const datestr = new Date(props.mission.date).toISOString().split('T')[0]
            const timestr = props.mission.startTime
            const date = new Date(`${datestr}T${timestr}`)

            // If the start date is in the past, the mission is fully extrapolated
            if (fns.isBefore(date, new Date())) {
                return <p style={{ color: 'orange' }}>
                    Extrapolation complète
                </p>
            }

            return <p style={{ color: 'green' }}>
                La mission est prévue pour {date.toLocaleTimeString()}
            </p>

        } else /* No start time information */ {
            return <p style={{ color: 'green' }}>
                La mission n'a pas encore commencé.
            </p>
        }
    }

    // At this state we consider the mission to be started. Either the chauffeur said POB, or the mission's startdate is passed.



    if (!props.geolocation?.mission.eta) /* We dont have any ETA */ {

        // Maybe because there's no 2 steps
        const locs = typeof (props.geolocation?.mission.locations) === 'string' ? JSON.parse(props.geolocation?.mission.locations) : props.geolocation?.mission.locations
        if (locs.length < 2) {
            return <p style={{ color: 'orange' }}>
                Pas de trajet enregistré, estimation du temps impossible
            </p>
        }

        // No ETA but we have 2 steps and the mission is not finished
        return <p style={{ color: 'orange' }}>
            status={props.mission.status}
        </p>

    } else /* ETA exists */ {


        if(props.geolocation.mission.chauffeur_clicked_pob_at == null) {
            return <p style={{ color: 'orange' }}>
                Le chauffeur n'a pas encore cliqué sur "POB", l'extrapolation considère un départ à {props.mission.startTime}
            </p>
        }

        const geolocdate = new Date(props.geolocation.geolocation?.timestamp)

        if(!props.geolocation.geolocation || !geolocdate) {
            return <p style={{ color: 'orange' }}>
                Extrapolation complète
            </p>
        }

        if(geolocdate && fns.differenceInMinutes(new Date(), geolocdate) > 5) {
            return <p style={{ color: 'orange' }}>
                Dernière position connue il y a {fns.differenceInMinutes(new Date(), geolocdate)} minutes
            </p>
        } else {
            return <p style={{ color: 'green' }}>
                Mission à jour
            </p>
        }

    }


    return "????"
    return null;

}
