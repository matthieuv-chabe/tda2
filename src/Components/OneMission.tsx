import { ArrowForward } from "@mui/icons-material";
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	Skeleton,
} from "@mui/material";
import { DriverName } from "./MissionPanel/DriverName";
import { LicencePlate } from "./MissionPanel/LicencePlate";
import { MissionT } from "../App";
import I18 from "../i18n";

import arrowDown from "../../public/arrowBottom.svg";
import { CarLocationManager } from "../core/CarLocationManager";
import { isWMissionTimeBased } from "../business/missionWCategories";
const t = I18.t.bind(I18)


const shortName = (name: string, maxLen = 20) => {

	if (!name) return "";

	if (name.length <= maxLen) {
		return name;
	}

	return name.slice(0, maxLen) + "...";
};

export const OneMission = (props: {
	mission: MissionT;
	onMissionChange: (mission: MissionT) => void;
	exp: boolean;
	index: number;
	onClicked: (index: number, mission: MissionT) => void;
	isSelected: boolean; // New prop
}) => {
	const exp = props.exp || props.isSelected; // Use the new prop

	const additionalcss = props.exp ? { filter: "none" } : {};

	// try {
	// 	const shouldShow = props.mission.arrival.remaining

	// 	// alert(shouldShow)

	// 	const hours = parseInt(shouldShow.split(" ")[0].replace("h", ""))
	// 	const mins = parseInt(shouldShow.split(" ")[1].replace("min", ""))

	// 	// alert(hours + " " + mins)

	// 	if(hours <= 0 || ( hours == 0 && mins > 45)) {
	// 		return null
	// 	} 

	// }	catch(e) {
	// 	return JSON.stringify(e)
	// }

	const arrival_estimated = props.mission.w.MIS_DATE_DEBUT + 'T' + props.mission.w.MIS_HEURE_FIN;
	const date_ae = new Date(arrival_estimated);
	const date_now = new Date();

	const diff_in_minutes = Math.floor((date_ae.getTime() - date_now.getTime()) / 60000);

	// if(Math.abs(diff_in_minutes) > 45) {
	// 	return null;
	// };

	if (props.mission.debug == 'do_not_compute') {
		return null;
	}

	const arrivalDefault = new Date(props.mission.w.MIS_DATE_DEBUT + 'T' + props.mission.w.MIS_HEURE_FIN);
	const arrivalEstimation = CarLocationManager.missions.find(m => m.w.MIS_ID == props.mission.w.MIS_ID)?.remainingStr


	let str = t('plannedArrivalAt') + " " + arrivalDefault.toLocaleTimeString().substring(0, 5);
	let color = 'black'

	if (arrivalEstimation && !isNaN(parseInt(arrivalEstimation))) {

		const v = Math.ceil(parseInt(arrivalEstimation) * 1.1 + 2); //Fix :)

		if (v < 5) {
			color = 'red'
		}

		if (v <= 0) {
			str = t('driverArrived');
		} else {
			str = t('estimatedArrivalIn') + " " + v + " " + t('minutesSuffix');
		}

	}

	const is_mad = isWMissionTimeBased(props.mission.w.MIS_TSE_ID, CarLocationManager.first_dispatch);
	if(is_mad) {
		str = t('missionEndsAt') + " " + arrivalDefault.toLocaleTimeString().substring(0, 5);
	}

	return (
		<>
			<Accordion
				onChange={() => {
					props.onClicked(props.index, props.mission);
				}}
				expanded={exp}
				style={{
					backgroundColor: exp ? "" : "#f5f5f5",
					borderRadius: exp ? 10 : 0,
					...additionalcss,
				}}
			>
				<AccordionSummary>
					<div style={{ width: "100%" }} id={"OneMission-" + props.mission.id}>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: 0,
								width: "100%",
							}}
						>
							<div style={{ flex: 1 }} title={props.mission.w.MIS_ID}>
								{/* {JSON.stringify(props.mission.w)} */}
								{/* #region Pin and tags */}
								{/* <div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										marginBottom: 5,

										// 5px space between chips
										gap: 5,
									}}
								>
									<PinIcon
										color="grey"
										pinned={props.mission.pinned}
										onPinChange={(pinned) => {
											console.log("Pin change", pinned)
											props.onMissionChange({
												...props.mission,
												pinned: pinned
											})
										}
										}
									/>

									{props.mission.tags.map((tag, index) => {
										return (
											<Chip
												style={{
													border: tag == 'VIP' ? "solid gold 2px" : undefined,
												}}
												key={index}
												label={tag}
												size="small"
											/>
										);
									})}
								</div> */}
								<p>
									{/* {props.mission.w.MIS_ID + " "} */}

									<div style={{ color: color }}>
										{
											// ARRIVEE PREVUE
											str
										}
									</div>

									{
										props.mission.acc &&
										<div style={{ backgroundColor: "purple", color: "white", borderRadius: 5, padding: 1, display: "inline-block", marginLeft: 5, fontSize: "small" }}>
											{t('greeting')}
										</div>

									}
								</p>
								{/* <p>Dans {props.mission.arrival.remaining}</p> */}
								{props.mission.info == "" ? <Skeleton variant="rectangular" width={210} height={20} /> : null}
								{props.mission.info && props.mission.info[0] != '?' && props.mission.info[0] != 'V' && <p style={{ color: "orange", fontSize: "small" }}>{props.mission.info}</p>}
								{props.mission.info && props.mission.info[0] == '?' && <p style={{ color: "darkblue", fontSize: "small" }}>{props.mission.info.substring(1)}</p>}
								{props.mission.info && props.mission.info[0] == 'V' && <p style={{ color: "green", fontSize: "small" }}>{props.mission.info.substring(1)}</p>}
								{/* #endregion */}
								{
									document.location.origin.indexOf("localhost") != -1 && props.mission.debug &&
									<p style={{ color: "lime", backgroundColor: 'black', padding: 5, width: '200px' }} dangerouslySetInnerHTML={{ __html: props.mission.debug }} />
								}
							</div>

							{
								props.mission.passenger == "??" &&
								<div style={{ fontSize: "smaller", opacity: '.8' }}>
									{t('unknownPassenger')}
								</div>
							}
							{
								props.mission.passenger != "??" &&
								<div style={{ flex: 1 }}>
									<p
										style={{
											textAlign: "right",
											maxWidth: "100%",
											overflow: "hidden",
											textOverflow: "ellipsis",
											fontSize: "1em",
											fontWeight: "50",
										}}

										title={props.mission.passenger.split(" ")[1] + " " + props.mission.passenger.split(" ")[0]}
									>
										{" "}
										{props.mission.passenger &&
											shortName(
												props.mission.passenger
													.split(" ")
													.slice(1)
													.join(" ")
													.toUpperCase(),
												20
											)
										}{" "}
										<span style={{ textTransform: "capitalize" }}>
											{props.mission.passenger &&
												shortName(
													props.mission.passenger.split(
														" "
													)[0],
													25
												)}
										</span>
									</p>
									{/* <Typography
									sx={{ mb: 1.5 }}
									color="text.secondary"
									style={{
										textAlign: "right",
									}}
								>
									+33 6 12 34 56 78
								</Typography> */}
								</div>
							}
							<div>
								<img
									title={t('showImminentArrivals')}
									src={arrowDown}
									style={{
										marginLeft: 10,
										rotate: props.exp ? "180deg" : "0deg",
									}}
								/>
							</div>
						</div>

						{/* <div
							style={{
								margin: 0,
								padding: 0,
								width: "100%",
								textAlign: "center",
								fontSize: 14,
								color: "rgba(0, 0, 0, 0.54)",
							}}
						>
							Voir plus
						</div> */}
					</div>
				</AccordionSummary>

				<AccordionDetails>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-evenly",

							backgroundColor: "#f5f5f5",
							padding: 10,
							borderRadius: 10,

							// Very slight shadow
							boxShadow: "0 0 5px 0 rgba(0,0,0,0.2)",
						}}
					>
						<div
							style={{
								textAlign: "center",
							}}
						>
							<Typography>{props.mission.locations.from}</Typography>
							<Typography variant="subtitle2">{props.mission.w.MIS_HEURE_DEBUT.substring(0, 5)}</Typography>
						</div>

						<div>
							<ArrowForward />
						</div>

						<div
							style={{
								textAlign: "center",
							}}
						>
							<Typography>
								{
									props.mission.locations.to.indexOf("%") != -1
										? t('arrivalPlaceUndefined')
										: props.mission.locations.to
								}
							</Typography>
							<Typography variant="subtitle2">
								{(props.mission.w.MIS_HEURE_FIN || "").substring(0, 5)}
							</Typography>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-evenly",
							marginTop: 10,

							backgroundColor: "#f5f5f5",
							padding: 10,
							borderRadius: 10,
							boxShadow: "0 0 5px 0 rgba(10,10,10,0.2)",
						}}
					>
						<div
							style={{
								flex: 1,
								textAlign: "center",
							}}
						>
							{props.mission.car_brand}<br />
							<LicencePlate platenum={props.mission.license_plate} />
						</div>
						<div style={{ flex: 1, textAlign: 'center' }}>
							<DriverName name={props.mission.chauffeur_name} phone={props.mission.chauffeur_phone} />

						</div>
					</div>

				</AccordionDetails>
			</Accordion>
		</>
	);
};
