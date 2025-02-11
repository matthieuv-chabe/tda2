import { useEffect, useState } from "react"
import { AdvancedMarker, Marker, Pin, useMap } from "@vis.gl/react-google-maps"
import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { useUserSelectionContext } from "./UserSelectionContext"
import { usePolylineForMission } from "../../../hooks/usePolylineForMission"
import { useExtrapol } from "../../../hooks/useExtrapol"

export const MissionMapDisplay = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number] | undefined,
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {

    const userselection = useUserSelectionContext();
    const [has_been_centered, setHasBeenCentered] = useState(false)

    const map = useMap()

    usePolylineForMission(props.geolocations.mission, userselection.selectedMission === props.mission?.id)
    const extrapolPos = useExtrapol(props.geolocations.mission, userselection.selectedMission === props.mission?.id)

    // Can't happen
    if (!props.mission || !props.geolocations) return null;

    useEffect(() => {
        setHasBeenCentered(false)
    }, [props.mission, userselection])

    useEffect(() => {
        if (
            userselection.selectedMission == props.mission!.id
            && !userselection.hasUserMovedMap
            && props.geolocations.geolocation?.lat
            && !has_been_centered
        ) {
            setHasBeenCentered(true)

            const bounds = new google.maps.LatLngBounds()
            bounds.extend(new google.maps.LatLng(props.geolocations.geolocation.lat, props.geolocations.geolocation.lng))
            bounds.extend(new google.maps.LatLng(props.geolocations.mission.locations.at(-1).lat, props.geolocations.mission.locations.at(-1).lng))

            map?.fitBounds(bounds, { top: 100, right: 100, bottom: 100, left: 100 })
            // map?.setCenter({ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng })
        }
    }, [userselection])

    if (!props.geolocations?.geolocation?.lat || !props.geolocations?.geolocation?.lng) {

        if(!extrapolPos) return null;

        return <Marker
            onClick={() => userselection.setSelectedMission(props.mission!.id)}
            position={{ lat: extrapolPos[1], lng: extrapolPos[0] }}
            icon={{
                url: '/public/logocarorange.svg',
                scaledSize: new google.maps.Size(30, 30),
            }}
            opacity={userselection.selectedMission == props.mission.id ? 1 : 0.5}
        // title={new Date(props.geolocations.geolocation.timestamp).toLocaleString()}
        />
    }

    return (
        <>

            {
                // Show the arrival with a pin if the mission is seslected
                userselection.selectedMission == props.mission.id &&
                <AdvancedMarker
                    position={new google.maps.LatLng(
                        props.geolocations.mission.locations.at(-1).lat,
                        props.geolocations.mission.locations.at(-1).lng
                    )}
                >
                    <Pin />
                </AdvancedMarker>
            }

            <Marker
                onClick={() => userselection.setSelectedMission(props.mission!.id)}
                position={{ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng }}
                icon={{
                    url: userselection.selectedMission == props.mission.id ? '/public/logocar.svg' : '/public/logocargrey.svg',
                    scaledSize: new google.maps.Size(30, 30),
                }}
                opacity={userselection.selectedMission == props.mission.id ? 1 : 0.5}
            // title={new Date(props.geolocations.geolocation.timestamp).toLocaleString()}
            />

        </>
    )
}
