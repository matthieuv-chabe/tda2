
import { paths } from "../../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../../generated/openapi_geolocation"
import * as fns from "date-fns"

type missionT = paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number]
type geolocationT = geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]

export const ExplanationMission = (props: {
    mission: missionT,
    geolocation?: geolocationT
}) => {

    const m_date = new Date(props.mission.date.substring(0,10) + "T" + props.mission.startTime);
    if (isNaN(m_date.getTime())) return "Date invalide"

    if (fns.isBefore(m_date, new Date())) {
        return <p style={{ fontSize:'smaller', color: 'green' }}>Mission en cours</p>
    }

    if(fns.isAfter(m_date, new Date())) {
        return <p style={{ fontSize:'smaller', color: 'black' }}>
            Mission prévue pour {fns.format(m_date, "HH:mm")}
        </p>
    }

}
