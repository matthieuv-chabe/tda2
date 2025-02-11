
import { paths } from "../../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../../generated/openapi_geolocation"
import * as fns from "date-fns"

type missionT = paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number]
type geolocationT = geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]

export const ExplanationEta = (props: {
    mission: missionT,
    geolocation?: geolocationT
}) => {

    const eta = new Date(props.geolocation?.mission.eta as unknown as string);
    if (isNaN(eta.getTime()) || eta.getTime() == 0) return null;

    // If ETA is in the past, we display the vehicle is in position for drop-offs
    if (fns.isBefore(eta, new Date())) {
        return <p style={{ color: 'green' }}>
            Vehicule en position pour Drop-Off
        </p>
    }

    // Else we simply display the last geolocation time
    if (fns.isAfter(eta, new Date())) {
        try {
            const lastgeo = new Date(props.geolocation?.geolocation?.timestamp as unknown as string);
            const minutes_since_last_geo = fns.differenceInMinutes(new Date(), lastgeo);

            // Format "x minutes" to "x hours x minutes"
            const formatted_time_last_geo = minutes_since_last_geo < 60
                ? minutes_since_last_geo
                : `${Math.floor(minutes_since_last_geo / 60)}h ${minutes_since_last_geo % 60}`

            if(isNaN(minutes_since_last_geo)) {
                return <p style={{color: 'orange'}}>
                    Aucune géolocalisation connue
                </p>
            }
            if(minutes_since_last_geo > 30) {
                return <p style={{ color: 'red' }}>
                    Dernière géolocalisation il y a {formatted_time_last_geo} minutes
                </p>
            } else if(minutes_since_last_geo > 5) {
                return <p style={{ color: 'orange' }}>
                    Dernière géolocalisation il y a {minutes_since_last_geo} minutes
                </p>
            } else if (minutes_since_last_geo < 2) {
                return <p style={{ color: 'black' }}>
                    Dernière géolocalisation maintenant
                </p>
            } else {
                return <p style={{ color: 'black' }}>
                    Dernière géolocalisation il y a {formatted_time_last_geo} minutes
                </p>
            }

        } catch {
            return "no geo"
        }
    }

}
