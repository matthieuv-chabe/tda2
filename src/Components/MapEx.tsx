
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { useRef } from 'react';

export const MapEx = (props: {
    children: JSX.Element | JSX.Element[],
	ondragstart: () => void,
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
                    console.log('Camera changed:', event);
                }}
				onCenterChanged={() => {
					console.log("Center changed")
				}}
				onDragstart={() => {
					props.ondragstart()
				}}
                
            >
                {/* <TrafficLayer /> */}
                {children.map((Child) => (Child))}
            </Map>            
        </APIProvider>
    )
}
