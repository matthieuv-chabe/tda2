import { useEffect, useState } from "react"
import { paths } from "../../generated/openapi_geolocation"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

export const usePolylineForMission = (
    missionDef: paths["/v1/geolocation/missions/tda"]["post"]["responses"]["200"]["content"]["application/json"][number]['mission']['last_google_path_result'],
    enabled: boolean
) => {

    
    const geometryLibrary = useMapsLibrary('geometry')
    const map = useMap()
    const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null)
    
    useEffect(() => {
        if(!geometryLibrary) return;
        if(!map) return;

        let obj = {}
        
        try {
            obj = JSON.parse(missionDef);
        } catch {
            obj = {}
        }
        
        if(!missionDef || !obj || Object.keys(obj).length == 0) return;

        if(!enabled) {
            if(polyline) {
                polyline.setMap(null)
            }
            return;
        }

        setPolyline(new google.maps.Polyline({
            path: geometryLibrary.encoding.decodePath(obj.routes[0].polyline.encodedPolyline), // Decode the polyline
            geodesic: true,
            strokeColor: "#00007F",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map
        }))



    }, [geometryLibrary, map, enabled])

}
