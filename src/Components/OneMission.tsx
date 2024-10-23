import { ArrowForward } from "@mui/icons-material";
import {
	Accordion,
	AccordionSummary,
	Chip,
	Typography,
	AccordionDetails,
} from "@mui/material";
import { DriverName } from "./MissionPanel/DriverName";
import { LicencePlate } from "./MissionPanel/LicencePlate";
import { MissionT } from "../App";

import arrowDown from "../../public/arrowBottom.svg";

const shortName = (name: string, maxLen = 20) => {
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
									Arrivée à {props.mission.arrival.estimated}
								</p>
								<p>Dans {props.mission.arrival.remaining}</p>
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
								>
									{" "}
									{props.mission.passenger &&
										shortName(
											props.mission.passenger.split(
												" "
											)[1],
											25
										)}{" "}
									{props.mission.passenger &&
										shortName(
											props.mission.passenger
												.split(" ")[0]
												.toUpperCase(),
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
							<Typography variant="subtitle2">{props.mission.w.MIS_HEURE_DEBUT.substring(0,5)}</Typography>
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
							<Typography variant="subtitle2">{props.mission.w.MIS_HEURE_DEBUT.substring(0,5)}</Typography>
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
								textAlign: "center",
							}}
						>
							Mercedes S<br />
							<LicencePlate platenum="AA-000-FF" />
						</div>
						<DriverName name="M. Macho FEUR" />
					</div>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
