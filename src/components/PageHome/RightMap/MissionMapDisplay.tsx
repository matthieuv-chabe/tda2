import { Marker, Pin } from "@vis.gl/react-google-maps"
import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"

export const MissionMapDisplay = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number] | undefined,
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {

    if(!props.mission || !props.geolocations) return null;

    return (
        <>
            <Marker
                position={{ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng }}
                icon={{
                    url: '/public/logocargrey.svg',
                    scaledSize: new google.maps.Size(30, 30),
                }}
            />

            {/* <AdvancedMarker
                position={{ lat: props.geolocations.geolocation.lat, lng: props.geolocations.geolocation.lng }}
            >
                <Pin />
            </AdvancedMarker> */}

        </>
    )
}
