import { Marker, useMap } from "@vis.gl/react-google-maps"
import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { useUserSelectionContext } from "./UserSelectionContext"
import { useEffect } from "react"

export const MissionMapDisplay = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number] | undefined,
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {

    const map = useMap()

    if(!props.mission || !props.geolocations) return null;

    const userselection = useUserSelectionContext();
    const is_geolocation_old = new Date(props.geolocations.geolocation.timestamp as unknown as string).getTime() < Date.now() - 1000 * 60 * 5;

    const directionsResult = JSON.stringify(props.geolocations.mission.last_google_path_result) as unknown as google.maps.DirectionsResult;

    useEffect(() => {
        if(userselection.selectedMission == props.mission!.id && !userselection.hasUserMovedMap) {
            map?.setCenter({lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng})
        }
    }, [userselection])

    return (
        <>
            <Marker
                onClick={() => userselection.setSelectedMission(props.mission!.id)}
                position={{ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng }}
                icon={{
                    url: userselection.selectedMission == props.mission.id ? '/public/logocar.svg' : '/public/logocargrey.svg',
                    scaledSize: new google.maps.Size(30, 30),
                }}
                opacity={userselection.selectedMission == props.mission.id ? 1 : 0.5}
                title={is_geolocation_old ? "Old geolocation" : ""}
            />
        </>
    )
}
