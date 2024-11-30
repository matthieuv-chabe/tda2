import { useMap, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { LastKnownPositionInfo } from "../../App";
import { CarLocationManager } from "../../core/CarLocationManager";

function calculateRotation(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const toDegrees = (radians) => radians * 180 / Math.PI;
    
    const dLon = toRadians(lon2 - lon1);
    
    const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
    const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
              Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
    
    let angle = toDegrees(Math.atan2(y, x));
    return (angle + 360) % 360;  // to ensure the angle is between 0 and 360
}


export const CarLocEx = (props: {
    missionData: any,
    missionLastKnownPosition: LastKnownPositionInfo | null,
    showPath?: boolean,
    onCarClicked?: () => void
}) => {

    const map = useMap();    
    const iconRef = useRef<google.maps.Marker>(null);

    useEffect(() => {
        if(props.showPath) {
            const loc = CarLocationManager.GetLocation(props.missionData.w.MIS_ID)

            if(!loc || !loc.lat || !loc.lng) return;

            map?.setHeadingInteractionEnabled(true);
            map?.setTilt(45);
            map?.setZoom(18);
            map?.setCenter(loc);

            map?.setHeading(90);

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
            rotation: calculateRotation(curVector.start.lat(), curVector.start.lng(), curVector.end.lat(), curVector.end.lng())
        })

        // iconRef.current.setTitle("Car");

    }, [])


    return <Marker
        ref={iconRef}
        position={CarLocationManager.GetLocation(props.missionData.w.MIS_ID)}
        title={"test"}
        clickable={true}
        icon={{
            // url: '/car-top-view.svg', 
            // size: new google.maps.Size(50, 50),
            // scaledSize: new google.maps.Size(30, 30),
            fillColor: 'red',
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: 'red',
            strokeWeight: 10,
            scale: 3,
            // rotation: calculateRotation(curVector.start.lat(), curVector.start.lng(), curVector.end.lat(), curVector.end.lng())
        }}
        onClick={() => {
            // alert("Clicked")
            props.onCarClicked?.();
        }}

    />;

}
