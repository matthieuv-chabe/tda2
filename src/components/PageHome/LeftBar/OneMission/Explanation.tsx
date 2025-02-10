
import { paths } from "../../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../../generated/openapi_geolocation"

type missionT = paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number]
type geolocationT = geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]

export const Explanation = (props: {
    mission: missionT,
    geolocation?: geolocationT
}) => {

    if (!props.geolocation) {
        return <p style={{ color: 'grey' }}>
            Nous n'avons pas d'information sur cette mission.
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

    } else /* ETA exists */ {

        if (props.geolocation.mission.had_at_least_one_real_geolocation) {
            return <p style={{ color: 'green' }}>
                Le chauffeur a commencé la mission.
            </p>
        } else /* No real geolocation */ {
            return <p style={{ color: 'orange' }}>
                Le chauffeur n'a pas encore commencé la mission.
            </p>
        }

    }


    return (
        <>

            Explanation.

        </>
    )

}
