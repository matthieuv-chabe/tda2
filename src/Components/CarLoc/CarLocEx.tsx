import { useMap, Marker, useMapsLibrary, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
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
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

	useEffect(() => {
		if(!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
	}, [routesLibrary, map])

    useEffect(() => {
        if (props.showPath) {
            const loc = CarLocationManager.GetLocation(props.missionData.w.MIS_ID)

            if (!loc || !loc.lat || !loc.lng) return;

            map?.setHeadingInteractionEnabled(true);
            // map?.setTilt(45);
            // map?.setZoom(1);
            map?.setCenter(loc);

            // map?.setHeading(90);

			directionsRenderer?.setMap(map);
			directionsRenderer?.setOptions({
				polylineOptions: {
					strokeColor: '#061E3A',
					strokeWeight: 4
				}
			})

        }
    }, [props.showPath])

	useEffect(() => {

        if(!directionsService || !directionsRenderer) return;

        const start_pos_lat = parseFloat(props.missionData.w.C_Gen_EtapePresence[0].C_Geo_Lieu.LIE_LAT)
        const start_pos_lng = parseFloat(props.missionData.w.C_Gen_EtapePresence[0].C_Geo_Lieu.LIE_LNG)
        const end_pos_lat = parseFloat(props.missionData.w.C_Gen_EtapePresence[props.missionData.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu.LIE_LAT)
        const end_pos_lng = parseFloat(props.missionData.w.C_Gen_EtapePresence[props.missionData.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu.LIE_LNG)
                

        directionsService.route({
            origin: { lat: start_pos_lat, lng: start_pos_lng },
            destination: { lat: end_pos_lat, lng: end_pos_lng },
            travelMode: google.maps.TravelMode.DRIVING,
        }).then( response => {

            console.log("saged:")
            // setSavedDirectionServices(response);

            if(props.showPath)
            {
                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response);
                directionsRenderer.setOptions({
                    polylineOptions: {
                        strokeColor: '#061E3A',
                        strokeWeight: 4
                    }
                })
            }
            else
            {
                directionsRenderer.setMap(null);
            }
        })

    }, [directionsService, directionsRenderer, props.showPath])

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

	let lrl_diff_from_cur = 0;
	try {
		lrl_diff_from_cur = lrl ? Math.abs(lrl.lat - cur.lat) + Math.abs(lrl.lng - cur.lng) : 0;
	} catch (e) {
		console.log("Error while calculating lrl_diff_from_cur", e);
	}

    return [
        <Marker
            ref={iconRef}
            position={CarLocationManager.GetLocation(props.missionData.w.MIS_ID)}
            title={"Mission " + props.missionData.w.MIS_ID}
            clickable={true}
			icon={{
				url: '/public/logocar.svg',
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

        ((lrl && props.showPath && lrl_diff_from_cur) ? <AdvancedMarker
            // ref={iconRef}
            position={{ lat: lrl.lat, lng: lrl.lng }}
            title={"Dernière position connue du véhicule"}
            onClick={() => {
                props.onCarClicked?.();
            }}

        ><Pin glyphColor={'green'} background={'green'} scale={.5} /></AdvancedMarker> : null)

    ];

}
