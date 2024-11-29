import { ArrowForward } from "@mui/icons-material";
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
} from "@mui/material";
import { DriverName } from "./MissionPanel/DriverName";
import { LicencePlate } from "./MissionPanel/LicencePlate";
import { MissionT } from "../App";

import arrowDown from "../../public/arrowBottom.svg";

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
}) => {
	const exp = props.exp;

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
					<div style={{ width: "100%" }}>
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
							<div style={{ flex: 1 }}>
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
									Arrivée prévue à {props.mission.arrival.estimated}
									{
										props.mission.acc &&
										<div style={{ backgroundColor: "purple", color: "white", borderRadius: 5, padding: 1, display: "inline-block", marginLeft: 5, fontSize: "small" }}>
											Accueil
										</div>

									}
								</p>
								{/* <p>Dans {props.mission.arrival.remaining}</p> */}
								{props.mission.info && props.mission.info[0] != '?' && <p style={{ color: "red" }}>{props.mission.info}</p>}
								{props.mission.info && props.mission.info[0] == '?' && <p style={{ color: "darkblue" }}>{props.mission.info.substring(1)}</p>}
							</div>

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

									title={props.mission.passenger}
								>
									{" "}
									{props.mission.passenger &&
										shortName(
											props.mission.passenger.split(
												" "
											)[0],
											25
										)}{" "}
									{props.mission.passenger &&
										shortName(
											props.mission.passenger
												.split(" ")
												.slice(1)
												.join(" "),
											// .toUpperCase(),
											20
										)
									}
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
							<div>
								<img
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
							<Typography>{props.mission.locations.to}</Typography>
							<Typography variant="subtitle2">{props.mission.w.MIS_HEURE_FIN.substring(0, 5)}</Typography>
						</div>
					</div>

					{
						(props.mission.driver || props.mission.licencePlate) &&
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
									textAlign: "center",
								}}
							>
								{props.mission.car_brand}<br />
								<LicencePlate platenum={props.mission.license_plate} />
							</div>
							<DriverName name={props.mission.chauffeur_name} phone={props.mission.chauffeur_phone} />
						</div>
					}

				</AccordionDetails>
			</Accordion>
		</>
	);
};
