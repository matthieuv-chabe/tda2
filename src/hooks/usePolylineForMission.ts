import { useEffect, useState } from "react"
import { paths } from "../../generated/openapi_geolocation"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { GoogleRouteV2Result } from "../core/googleUtils";
import * as turf from "@turf/turf";

export const usePolylineForMission = (
    geolocation: paths["/v1/geolocation/missions/tda"]["post"]["responses"]["200"]["content"]["application/json"][number]['mission'],
    enabled: boolean
) => {


    // We decided to disable the polyline draw due to the uncertainty of the position that could
    //  move the location outside of the predicted path hence confusing the users.
    // return false;
    
    const geometryLibrary = useMapsLibrary('geometry')
    const map = useMap()

    const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null)
    const [itv, setItv] = useState<NodeJS.Timeout | null>(null)

    const [marker, setMarker] = useState<google.maps.Marker | null>(null)

    const missionDef = geolocation.last_google_path_result;

    const clearAll = () => {
        if(polyline) polyline.setMap(null)
        if(itv) clearInterval(itv)        
    }
    
    useEffect(() => {
        if(!geometryLibrary) return;
        if(!map) return;

        let obj = {} as unknown as GoogleRouteV2Result;
        
        try {
            obj = JSON.parse(missionDef);
        } catch {
            obj = {} as unknown as GoogleRouteV2Result;
        }
        
        if(!missionDef || !obj || Object.keys(obj).length == 0) return;

        if(!enabled) {
            clearAll()
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

        return () => {
            clearAll()
        }

    }, [geometryLibrary, map, enabled])

    useEffect(() => {
        return () => {
            clearAll()
        }
    }, [])

    

}
