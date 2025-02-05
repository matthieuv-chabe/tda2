import { Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { useUserSelectionContext } from "./UserSelectionContext"
import { useEffect, useState } from "react"
import { GoogleResponseToDirectionsResult } from "../../../core/googleUtils"
import { usePolylineForMission } from "../../../hooks/usePolylineForMission"

export const MissionMapDisplay = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number] | undefined,
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {

    const userselection = useUserSelectionContext();

    const map = useMap()

    usePolylineForMission(props.geolocations.mission.last_google_path_result, userselection.selectedMission === props.mission?.id)

    if (!props.mission || !props.geolocations) return null;

    const is_geolocation_old = new Date(props.geolocations.geolocation.timestamp as unknown as string).getTime() < Date.now() - 1000 * 60 * 5;

    useEffect(() => {
        if (userselection.selectedMission == props.mission!.id && !userselection.hasUserMovedMap) {
            map?.setCenter({ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng })
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
