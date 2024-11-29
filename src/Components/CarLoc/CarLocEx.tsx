import { useMap, useMapsLibrary, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { LastKnownPositionInfo } from "../../App";
import { GeolocExtrapolationComputer } from "../../core/utils/maps/maps";
import { CarAlgorithms } from "../../CarAlgorithms";
import { polyline_and_percent_to_latlng, polyline_and_percent_to_subpolyline } from "../../core/utils/maps/polyline";
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

// Example usage:
const rotationAngle = calculateRotation(48.8566, 2.3522, 51.5074, -0.1278);
console.log(rotationAngle);


export const CarLocEx = (props: {
    missionData: any,
    missionLastKnownPosition: LastKnownPositionInfo | null,
    showPath?: boolean
}) => {

    const map = useMap();    
    const iconRef = useRef<google.maps.Marker>(null);

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
