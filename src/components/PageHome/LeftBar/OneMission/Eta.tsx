import { useTranslation } from 'react-i18next';
import { paths as geolocpaths } from '../../../../../generated/openapi_geolocation';

export const Eta = (props: {
        geolocation?: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {


    if(!props.geolocation) {
        return ""
    }

    if(!props.geolocation?.mission?.eta) {
        return ""
    }

    // If ETA < now+5min, display the remaining time in red
    const eta = new Date(props.geolocation?.mission.eta as unknown as string)
    const now = new Date()
    const diff = eta.getTime() - now.getTime()
    if(diff > 0 && diff < 5*60*1000) {
        return <p style={{color: 'red'}}>T-{Math.floor(diff / (60 * 1000))}min</p>
    } else if (diff <= 0) {
        return <p style={{color: 'red'}}>Chauffeur sur site</p>
    }

    // Else, display the time
    return <p>Heure d'arrivée estimée {eta.toLocaleTimeString().substring(0, 5)}</p>
}
