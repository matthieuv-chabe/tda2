import { useMap, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { LastKnownPositionInfo } from "../../App";
import { CarLocationManager } from "../../core/CarLocationManager";


export const CarLocEx = (props: {
    missionData: any,
    missionLastKnownPosition: LastKnownPositionInfo | null,
    showPath?: boolean
}) => {

    const map = useMap();    
    const iconRef = useRef<google.maps.Marker>(null);

    useEffect(() => {
        if(props.showPath) {
            const loc = CarLocationManager.GetLocation(props.missionData.w.MIS_ID)

            if(!loc || !loc.lat || !loc.lng) return;

            map?.panTo({
                    lat: loc.lat,
                    lng: loc.lng
            })

        }
    }, [props.showPath])

    useEffect(() => {
        if(!iconRef.current) return;

        // alert("Setting icon");   

        iconRef.current.setIcon({
            url: '/car-top-view.svg', 
            // size: new google.maps.Size(50, 50),
            scaledSize: new google.maps.Size(30, 30),
            fillColor: 'red',
            rotation: 90//calculateRotation(curVector.start.lat(), curVector.start.lng(), curVector.end.lat(), curVector.end.lng())
        })

        // iconRef.current.setTitle("Car");

    }, [])

    return <Marker
        ref={iconRef}
        position={CarLocationManager.GetLocation(props.missionData.w.MIS_ID)}

    />;

}
