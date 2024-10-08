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
import { PinIcon } from "./PinIcon";
import { MissionT } from "../App";

const shortName = (name: string) => {
	if (name.length <= 20) {
		return name;
	}

	return name.slice(0, 20) + "...";
};

export const OneMission = (props: { 
    mission: MissionT,
    onMissionChange: (mission: MissionT) => void
}) => {
	return (
		<>
			<Accordion style={{ background: "#f5f5f5" }}>
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
								<div
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
                                        color="green"
                                        pinned={props.mission.pinned}
                                        onPinChange={(pinned) => {
                                            console.log("Pin change", pinned)
                                            props.onMissionChange({
                                                ...props.mission,
                                                pinned: pinned
                                            })}
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
								</div>
								<p>
									Arrivée à
									<Typography
										variant="h5"
										component="b"
										style={{
											fontSize: "1.5em",
										}}
									>
										{props.mission.arrival.estimated}
									</Typography>
								</p>
								<Typography
									sx={{ mb: 1.5 }}
									color="text.secondary"
								>
									Dans {props.mission.arrival.remaining}
								</Typography>
							</div>

							<div style={{ flex: 1 }}>
								<Typography
									variant="h6"
									component="div"
									style={{
										textAlign: "right",
										maxWidth: "100%",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									M.{" "}
									{shortName(
										"DUPONTDUPONTDUPONTDUPONTDUPONTDUPONTDUPONTDUPONTDUPONT"
									)}{" "}
									JeanJeanJeanJeanJeanJean
								</Typography>
								<Typography
									sx={{ mb: 1.5 }}
									color="text.secondary"
									style={{
										textAlign: "right",
									}}
								>
									+33 6 12 34 56 78
								</Typography>
							</div>
						</div>

						<div
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
						</div>
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
							<Typography>Aéroport CDG</Typography>
							<Typography variant="subtitle2">12:00</Typography>
						</div>

						<div>
							<ArrowForward />
						</div>

						<div
							style={{
								textAlign: "center",
							}}
						>
							<Typography>Hotel de la Paix</Typography>
							<Typography variant="subtitle2">15:00</Typography>
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
