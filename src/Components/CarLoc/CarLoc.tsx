import React, { useEffect } from "react";

import { test2 as chemin } from "../../test2";

import styles from "./CarLoc.module.css";
import { GglPathResponse } from "../../core/utils/maps";
import { polyline_and_percent_to_latlng } from "../../core/utils/maps/polyline";
import { seconds_to_human } from "../../core/utils/stringutils";


let i = 0;

const drivePlanCoordinates = chemin.routes[0].overview_path.map((step) => {
	return {
		lat: step.lat,
		lng: step.lng,
	};
});

const latslongs_to_polyline = (latslongs: { lat: number; lng: number }[]) => {
	return latslongs.map((latlong) => {
		return {
			lat: latlong.lat,
			lng: latlong.lng,
		};
	});
};

const mission_start_time = new Date();

export const CarLoc: React.FC<google.maps.MarkerOptions> = (options) => {
	const [strokeColor, setStrokeColor] = React.useState("orange");
	useEffect(() => {
		const intv = setInterval(() => {
			setStrokeColor(strokeColor === "black" ? "white" : "white");
		}, 1000);
		return () => {
			clearInterval(intv);
		};
	});

	const [trafficLayer, setTrafficLayer] =
		React.useState<google.maps.TrafficLayer>(); // traffic layer

	const [marker, setMarker] = React.useState<google.maps.AdvancedMarkerElement>(); // marker on the map, test
	const [infoWindow, setInfoWindow] =
		React.useState<google.maps.InfoWindow>(); // marker on the map, test

	const [line, setLine] = React.useState<google.maps.Polyline>(); // path of the car
	const [bgline, setBgline] = React.useState<google.maps.Polyline>(); // path of the car
	const [fullline, setFullline] = React.useState<google.maps.Polyline>(); // path of the car

	const [mx, _setMx] = React.useState<google.maps.Marker>(); // marker extrapolation
	const [linelabel, setLinelabel] = React.useState<google.maps.Marker>();

	const [iv, setIv] = React.useState<NodeJS.Timeout>(); // interval for extrapolation

	const [pathR, _setPathR] = React.useState<GglPathResponse>(
		new GglPathResponse(chemin)
	);

	// const distmatrix = new google.maps.DistanceMatrixService();
	// const directionsService = new google.maps.DirectionsService();

	// From direction service, get the time of each step to define on which step the car is

	useEffect(() => {
		const listener = (e: MessageEvent) => {
			console.log(e);
		};

		window.addEventListener("message", listener);
		return () => {
			window.removeEventListener("message", listener);
		};
	}, []);

	const str_to_polyline = (str: string) => {
		return google.maps.geometry.encoding.decodePath(str);
	};

	// React.useEffect(() => {
	//     distmatrix.getDistanceMatrix({
	//         origins: [flightPlanCoordinates[0]],
	//         destinations: [flightPlanCoordinates[1]],
	//         travelMode: google.maps.TravelMode.DRIVING,
	//         unitSystem: google.maps.UnitSystem.METRIC,
	//         avoidHighways: false,
	//         avoidTolls: false,
	//     }, (response, status) => {

	//         // Write response in file
	//         // fs.writeFile('response.json', JSON.stringify(response), (err) => {
	//         //     if (err) throw err;
	//         //     console.log('The file has been saved!');
	//         // });

	//         console.log(JSON.stringify(response))
	//         console.log(status)
	//     })
	// }
	// ,[])

	// React.useEffect(() => {
	//     directionsService.route({
	//         origin: flightPlanCoordinates[0],
	//         destination: flightPlanCoordinates[1],
	//         travelMode: google.maps.TravelMode.DRIVING,
	//     }, (response, status) => {
	//         if (status === 'OK') {

	//             console.log(JSON.stringify(response))

	//             if(cb) {
	//                 cb.setMap(null);
	//             }
	//             setCb(new google.maps.Polyline({
	//                 path: response?.routes[0].overview_path,
	//                 geodesic: true,
	//                 strokeColor: "#00FF00",
	//                 strokeOpacity: 1.0,
	//                 strokeWeight: 2,
	//             }));
	//         } else {
	//             console.log("error")
	//         }
	//     })
	// }, [marker])

	React.useEffect(() => {
		if (!marker) {
			setMarker(new google.maps.Marker());
		}

		if (!trafficLayer) {
			const tl = new google.maps.TrafficLayer();
			setTrafficLayer(tl);
		}

		if (!infoWindow) {
			const iw = new google.maps.InfoWindow();
			setInfoWindow(iw);
		}

		if (!fullline) {
			setFullline(
				new google.maps.Polyline({
					path: latslongs_to_polyline(drivePlanCoordinates),
					geodesic: true,
					strokeColor: "#061E3A",
					strokeOpacity: 0.7,
					strokeWeight: 7,
					zIndex: 0,
				})
			);
		}

		if (!linelabel) {
			setLinelabel(
				new google.maps.Marker({
					position: { lat: 48.8534, lng: 2.3488 },
					title: "Hello World!",
					opacity: 1,
					label: {
						text: "[loading]",
						color: "#061E3A", // dark blue
						fontSize: "16px",
						fontWeight: "bold",
						className: styles.label,
					},
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 0,
					},
					anchorPoint: new google.maps.Point(100, 0),
				})
			);
		}

		if (!line) {
			setBgline(
				new google.maps.Polyline({
					path: latslongs_to_polyline(drivePlanCoordinates),
					geodesic: true,
					strokeColor: "#061E3A",
					strokeOpacity: 1,
					strokeWeight: 7,
					icons: [
						{
							icon: {
								path: google.maps.SymbolPath
									.FORWARD_CLOSED_ARROW,
								strokeColor: "#061E3A",
								strokeOpacity: 1.0,
								strokeWeight: 7,
								fillColor: "#061E3A",
								fillOpacity: 1.0,
								scale: 3,
								labelOrigin: new google.maps.Point(0, 0),
							},
							offset: "100%",
							repeat: "0",
						},
					],
					zIndex: 1,
				})
			);

			setLine(
				new google.maps.Polyline({
					path: latslongs_to_polyline(drivePlanCoordinates),
					geodesic: true,
					strokeColor: "#DE2B4E",
					strokeOpacity: 1.0,
					strokeWeight: 3,
					icons: [
						{
							icon: {
								path: google.maps.SymbolPath
									.FORWARD_CLOSED_ARROW, // ======================================================================
								strokeColor: "#DE2B4E",
								strokeOpacity: 1.0,
								strokeWeight: 2,
								fillColor: "#DE2B4E",
								fillOpacity: 1.0,
								scale: 3,
								labelOrigin: new google.maps.Point(0, 0),
							},
							offset: "100%",
							repeat: "0",
						},
					],
					zIndex: 10,
				})
			);
		}

		setIv(
			setInterval(() => {
				// console.log({line, marker, circle})

				// @ts-ignore
				if (marker?.getMap()) {
					// @ts-ignore
					line?.setMap(marker?.getMap());
					// @ts-ignore
					bgline?.setMap(marker?.getMap());
					// @ts-ignore
					// linelabel?.setMap(marker?.getMap());
					// @ts-ignore
					infoWindow?.setMap(marker?.getMap());

					// @ts-ignore
					fullline?.setMap(marker?.getMap());

					// @ts-ignore
					trafficLayer?.setMap(marker?.getMap());
				}

				// if (marker && circle) {
				if (marker && line && infoWindow) {
					marker.setIcon({
						path: google.maps.SymbolPath.CIRCLE,
						scale: 0,
						fillColor: "#DE2B4E",
						fillOpacity: 1,
						strokeColor: "#061E3A",
						strokeWeight: 3,
					});

					const position = marker.getPosition();
					if (position) {
						const timeElapsed =
							new Date().getTime() - mission_start_time.getTime();
						const curpath = pathR.info_at_time(timeElapsed / 1000);

						if (curpath) {
							const p = str_to_polyline(curpath.polylinepos);
							const pp = p.map((e) => ({
								lat: e.lat(),
								lng: e.lng(),
							}));

							line.setPath(pp);
							bgline?.setPath(pp);

							// If current step is longer than 2 steps, move the label to the middle of the line
							if (p.length > 2) {
								const mid = Math.floor(p.length / 2);
								const midlatlng = p[mid];
								linelabel?.setPosition({
									lat: midlatlng.lat(),
									lng: midlatlng.lng(),
								});
							} else {
								linelabel?.setPosition({
									lat: p[0].lat(),
									lng: p[0].lng(),
								});
							}

							// const remaining_time = p[p.length - 1]. - timeElapsed / 1000;

							// linelabel?.setLabel({
							//     text: `ETA ${seconds_to_human(curpath.ETA_in_seconds || 0)}\n${curpath.percent_of_current_path}`,

							//     color: "#061E3A",
							//     fontSize: "16px",
							//     fontWeight: "bold",
							//     className: styles.label
							// });

							const markpos = polyline_and_percent_to_latlng(
								curpath.polylinepos,
								curpath.percent_of_current_path!
							);
							marker.setPosition(markpos);

							// Set marker color to green if the car is at the end of the path
							if (true) {
                                console.log("curpath.percent_of_current_path", curpath.percent_of_current_path)
								line.setOptions({
									icons: [
										{
											icon: {
												path: google.maps.SymbolPath
													.FORWARD_CLOSED_ARROW, // ======================================================================
												strokeColor: strokeColor,
												strokeOpacity: 1.0,
												strokeWeight: 2,
												fillColor: strokeColor,
												fillOpacity: 1.0,
												scale: 3,
												labelOrigin:
													new google.maps.Point(0, 0),
											},
										},
									],
								});
								// {
								//     path: google.maps.SymbolPath
								//         .FORWARD_CLOSED_ARROW, // ======================================================================
								//     strokeColor: strokeColor,
								//     strokeOpacity: 1.0,
								//     strokeWeight: 2,
								//     fillColor: strokeColor,
								//     fillOpacity: 1.0,
								//     scale: 3,
								//     labelOrigin: new google.maps.Point(0, 0),
								// }
							}

							infoWindow.setPosition(marker.getPosition());
							// infoWindow.bindTo('anchor', marker, 'anchor');
							infoWindow.setContent(`
                            <div style="font-size: 16px; font-weight: bold; color: #061E3A; width:100%">
                                ETA ${seconds_to_human(
									curpath.ETA_in_seconds || 0
								)}
                            </div>
                        `);
						}

						++i;
					}
				}
			}, 100)
		);

		setInterval(() => {
			// Every 10 seconds, zoom and pan to fit the whole path
			// @ts-ignore
			if (marker?.getMap()) {
				const bounds = new google.maps.LatLngBounds();
				drivePlanCoordinates.forEach((coord) => {
					bounds.extend(coord);
				});

				(marker?.getMap() as google.maps.Map).fitBounds(bounds);
			}
		}, 1000);

		// remove marker from map on unmount
		return () => {
			// if (marker) {
			//     marker.setMap(null);
			// }
			// if (circle) {
			//     circle.setMap(null);
			// }
			// if (line) {
			//     line.setMap(null);
			// }

			clearInterval(iv!);
			console.log("ded");
		};
	}, [line, mx, linelabel, fullline]);

	React.useEffect(() => {
		if (marker) {
			marker.setOptions(options);
		}
	}, [marker, options]);

	return null;
};
