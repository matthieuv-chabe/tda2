import { AdvancedMarker, useMap, useMapsLibrary,  } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const CarLocEx = (props: {
    showPath?: boolean
}) => {

    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    

    // Initialize
    useEffect(() => {

        if(!routesLibrary || !map) return;

        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

    }, [routesLibrary, map])

    // Use direction services
    useEffect(() => {

        if(!directionsService || !directionsRenderer) return;

        directionsService.route({
            origin: { lat: 48.8965761, lng: 2.1844386 },
            destination: { lat: 48.7950543, lng: 2.3047701 },
            travelMode: google.maps.TravelMode.DRIVING
        }).then( response => {
            if(props.showPath)
            {
                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response);
            }
            else
                directionsRenderer.setMap(null);
            setRoutes(response.routes);
        })

    }, [directionsService, directionsRenderer, props.showPath])

    return null;

}
