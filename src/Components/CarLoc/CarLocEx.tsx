import { useMap, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
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
    const routesLibrary = useMapsLibrary('routes')!;
    const iconRef = useRef<google.maps.Marker>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

	useEffect(() => {
		if(!routesLibrary || !map) return;
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
	}, [routesLibrary, map])

    useEffect(() => {
        if (props.showPath) {
            const loc = CarLocationManager.GetLocation(props.missionData.w.MIS_ID)

            if (!loc || !loc.lat || !loc.lng) return;

            map?.setHeadingInteractionEnabled(true);
            // map?.setTilt(45);
            map?.setZoom(18);
            map?.setCenter(loc);

            // map?.setHeading(90);

        }
    }, [props.showPath])

	useEffect(() => {

		if(props.showPath) {
			const loc = CarLocationManager.GetLocation(props.missionData.w.MIS_ID)
			map?.setCenter(loc);
		}

	}, [props.showPath, props.missionData, props.missionLastKnownPosition])

    useEffect(() => {
        if (!iconRef.current) return;

        // alert("Setting icon");   

        iconRef.current.setIcon({
            url: '/car-top-view.svg',
            scaledSize: new google.maps.Size(30, 30),
            fillColor: 'red',
            rotation: calculateRotation(curVector.start.lat(), curVector.start.lng(), curVector.end.lat(), curVector.end.lng())
        })


    }, [])

    const lrl = CarLocationManager.GetLastReceivedLocation(props.missionData.w.MIS_ID);
	const cur = CarLocationManager.GetLocation(props.missionData.w.MIS_ID);

	const lrl_diff_from_cur = lrl ? Math.abs(lrl.lat - cur.lat) + Math.abs(lrl.lng - cur.lng) : 0;

    return [
        <Marker
            ref={iconRef}
            position={CarLocationManager.GetLocation(props.missionData.w.MIS_ID)}
            title={"Mission " + props.missionData.w.MIS_ID}
            clickable={true}
			icon={{
				url: '/public/car-top-view.svg',
				scaledSize: new google.maps.Size(30, 30),
			}}
            // icon={{
            //     fillColor: 'red',
            //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            //     strokeColor: 'blue',
            //     strokeWeight: 5,
            //     scale: 4,
            // }}
            onClick={() => {
                props.onCarClicked?.();
            }}

        />,

        ((lrl && props.showPath && lrl_diff_from_cur) ? <Marker
            ref={iconRef}
            position={{ lat: lrl.lat, lng: lrl.lng }}
            title={"Dernière position connue du véhicule"}
            onClick={() => {
                props.onCarClicked?.();
            }}

        /> : null)

    ];

}
