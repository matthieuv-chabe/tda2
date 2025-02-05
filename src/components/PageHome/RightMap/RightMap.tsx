import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { Wrapper } from "@googlemaps/react-wrapper";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { MissionMapDisplay } from "./MissionMapDisplay";
import { useUserSelectionContext } from "./UserSelectionContext";


export const RightMap = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json']
}) => {

    const userselection = useUserSelectionContext();   
    

    return (
        <div className="vertical-right" style={{ color: 'white', height: '200', overflow: 'hidden' }}>
            <Wrapper
                apiKey="AIzaSyB-WItzMk3oqLm8PUjhsrPNSlX09wiLDcQ"
            >
                <APIProvider
                    apiKey={'AIzaSyB-WItzMk3oqLm8PUjhsrPNSlX09wiLDcQ'}
                >
                    <Map
                        mapId={'f375369fdfba970b'}
                        defaultZoom={12}
                        defaultCenter={{ lat: 48.8566, lng: 2.3522 }}

                        onDrag={() => userselection.setHasUserMovedMap(true)}
                    >

                        {
                            props.geolocations.map(g => {
                                const mis = props.missions.find(m => m.wayniumid === g.mission.wayniumid);
                                return <MissionMapDisplay key={g.mission.id} mission={mis} geolocations={g} />
                            })
                        }

                    </Map>
                </APIProvider>
            </Wrapper>
        </div >
    )
}
