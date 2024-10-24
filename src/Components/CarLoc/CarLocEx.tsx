import { AdvancedMarker, useMap, useMapsLibrary,  } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { LastKnownPositionInfo } from "../../App";
import { GeolocExtrapolationComputer } from "../../core/utils/maps/maps";
import { CarAlgorithms } from "../../CarAlgorithms";

export const CarLocEx = (props: {
    missionData: any,
    missionLastKnownPosition: LastKnownPositionInfo | null,
    showPath?: boolean
}) => {

    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    
    const [savedDirectionServices, setSavedDirectionServices] = useState<google.maps.DirectionsResult | null>(null);
    const savedGeolocExtrapolationComputed = useRef<{data:GeolocExtrapolationComputer | null}>({data: null});
    const [carMarkerLocation, setCarMarkerLocation] = useState<google.maps.LatLngLiteral | null>(null);

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

            console.log("saged:")
            setSavedDirectionServices(response);

            if(props.showPath)
            {
                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response);
                directionsRenderer.setOptions({
                    polylineOptions: {
                        strokeColor: 'rgb(100,100,255)',
                        strokeWeight: 4
                    }
                })
            }
            else
                directionsRenderer.setMap(null);
            setRoutes(response.routes);
        })

    }, [directionsService, directionsRenderer, props.showPath])


    useEffect(() => {

        // 3 cases : 
        // - missionLastKnownPosition is null : we have no fucking idea about anything. We can show the expected path and
        //                                      extrapolate the shit out of it. Begin date = mission.MIS_DATE_DEBUT, then
        //                                      everything is based on google maps estimates.
        // - missionLastKnownPosition < 5 min : The geolocation is accurate, dont extrapolate anything.
        // - missionLastKnownPosition > 5 min : Ask the server again about the position, which becomes the new start location
        //                                      then consider missionLastKnownPosition.date as the mission start date. then
        //                                      extrapolate everything based on that.

        const iv = setInterval(async () => {

            if(props.missionLastKnownPosition == null) {
                // Case 1 we extrapolate from mission start loc, mission start time, mission end loc
                // const mission_start_loc = props.missionData.
                const start_pos_lat = parseFloat(props.missionData.w.C_Gen_EtapePresence[0].C_Geo_Lieu.LIE_LAT)
                const start_pos_lng = parseFloat(props.missionData.w.C_Gen_EtapePresence[0].C_Geo_Lieu.LIE_LNG)
                const end_pos_lat = parseFloat(props.missionData.w.C_Gen_EtapePresence[props.missionData.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu.LIE_LAT)
                const end_pos_lng = parseFloat(props.missionData.w.C_Gen_EtapePresence[props.missionData.w.C_Gen_EtapePresence.length - 1].C_Geo_Lieu.LIE_LNG)
                const start_time = new Date(props.missionData.w.MIS_DATE_DEBUT + "T" + props.missionData.w.MIS_HEURE_DEBUT)

                if(!savedGeolocExtrapolationComputed.current.data) {
                    
                    console.log({GEC: savedDirectionServices})
                    const gec = new GeolocExtrapolationComputer(savedDirectionServices!, {compute_timeinfo_at_init: true});
                    
                    savedGeolocExtrapolationComputed.current.data = gec;
                }

                const elapsed_since_start = (new Date().getTime() - start_time.getTime()) / 1000 -11000;
                const data = savedGeolocExtrapolationComputed.current.data.info_at_time(elapsed_since_start);

                const position_polyline = data?.polylinepos;
                const position_coords = CarAlgorithms.decodePolylineFlat(position_polyline || "");

                console.log({position_coords});

                setCarMarkerLocation(position_coords[0]);
            }

        }, 1_000);

        return () => clearInterval(iv);

    }, [savedDirectionServices])

    return <AdvancedMarker
        position={carMarkerLocation}
    />;

}
