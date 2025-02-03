import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { Wrapper } from "@googlemaps/react-wrapper";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { MissionMapDisplay } from "./MissionMapDisplay";


export const RightMap = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
    geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json']
}) => {

    return (
        <div className="vertical-right" style={{ color: 'white', height: '200', overflow: 'hidden' }}>
            <Wrapper
                apiKey="AIzaSyDMZQ3-mM6E1c95TXCnuVmqB9xXwD-M_iY"
            >
                <APIProvider
                    apiKey={'AIzaSyDp4CFGl9RpEloPpG7A-i2o_RRfGeCpVN8'}
                >
                    <Map
                        mapId={'f375369fdfba970b'}
                        defaultZoom={12}
                        defaultCenter={{ lat: 48.8566, lng: 2.3522 }}
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
