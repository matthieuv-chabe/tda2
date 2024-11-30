
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { TrafficLayer } from './TrafficLayer';
import { useRef } from 'react';

export const MapEx = (props: {
    children: JSX.Element | JSX.Element[]
}) => {

    const children = Array.isArray(props.children) ? props.children : [props.children];
    const tiltRef = useRef<NodeJS.Timeout | null>(null)

    return(
        <APIProvider
            apiKey={'AIzaSyDp4CFGl9RpEloPpG7A-i2o_RRfGeCpVN8'}
        >
            <Map
                mapId={'f375369fdfba970b'}
                defaultZoom={10}
                defaultCenter={{ lat: 48.8534, lng: 2.3488 }}
                onCameraChanged={(event: MapCameraChangedEvent) => {
                    // console.log('Camera changed:', event);
                }}
                
            >
                <TrafficLayer />
                {children.map((Child) => (Child))}
            </Map>            
        </APIProvider>
    )
}
