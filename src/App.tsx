import "./App.css";

import {
	Button,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Input,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ToggleButton,
	Typography,
} from "@mui/material";
import useUrlState from "./core/utils/useUrlState";

import { GeolocActualizer } from "./Components/GeolocActualizer";
import { OneMission } from "./Components/OneMission";
import { useEffect, useRef, useState } from "react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { Habilitation } from "./Habilitation";
import * as authconfig from "./authConfig";
import { CarLocationManager, CarLocationManagerC, MissionInfo } from "./core/CarLocationManager";
import { Wrapper } from "@googlemaps/react-wrapper";
import { CarLocEx } from "./Components/CarLoc/CarLocEx";
import { MapEx } from "./Components/MapEx";
GeolocActualizer.hi();

// const validate_url_tab = (value: string) => ['tab_missions_to_hotel', 'tab_missions_from_hotel', 'tab_missions_done'].includes(value)
const validate_url_size = (value: string) => ["true", "false"].includes(value);

export async function getAccessToken(instance: IPublicClientApplication) {
	const accessTokenRequest = {
		scopes: [
			`https://chabeazureb2cnpe.onmicrosoft.com/api-missions/user_access`,
		],
		account: instance.getAllAccounts()[0]!,
	};
	return instance
		.acquireTokenSilent(accessTokenRequest)
		.then((accessTokenResponse) => {
			return [accessTokenResponse.accessToken, accessTokenResponse] as const;
		});
}

export type MissionT = {

	w: any;

	id: number;
	info: string;
	debug: string;
	passenger: string;
	acc: boolean; // Is accueil
	tags: string[];
	arrival: {
		estimated: string;
		remaining: string;
	};
	pinned: boolean;
	locations: {
		from: string;
		to: string;
		cur: { lat: number; lng: number } | null;
	};
	chauffeur_name: string;
	chauffeur_phone: string;
	car_brand: string;
	license_plate: string;
};

function waynium_to_missiont(w: any, m: CarLocationManagerC, e: MissionInfo): MissionT | null {
	// console.log({ w });

	const get_name = (w: any) => {
		const p1 = w.C_Gen_Presence[0]?.C_Gen_Passager || { PAS_PRENOM: '', PAS_NOM: '' };

		const fname = ((p1.PAS_PRENOM || "") as string).trim()
		const lname = ((p1.PAS_NOM || "") as string).trim()

		if (fname == "" && lname == "") {
			return "??";
		}

		if (fname == "") {
			return lname.toUpperCase();
		}

		if (lname == "") {
			return fname + " (Name Unknown)";
		}

		return fname + " " + lname.toUpperCase();
	}

	const ms_to_hm = (ms: number) => {
		const hours = Math.floor(ms / 1000 / 60 / 60);
		const mins = Math.floor((ms / 1000 / 60) % 60);

		return `${hours}h ${mins}min`;
	}


	try {

		const estimated_arrival = w.MIS_HEURE_FIN as string // 01:01:01
		let ea = new Date(new Date().toISOString().substring(0, 10) + "T" + estimated_arrival)
		let eastr = null

		if (isNaN(ea.getTime())) {
			ea = new Date()
			eastr = "??"
		}

		try {
			eastr = ea.toTimeString()?.substring(0, 5)
		} catch (e) {
			eastr = "??"
		}

		const cgenchu = w.C_Gen_Chauffeur || { CHU_PRENOM: '', CHU_NOM: '', CHU_TEL_MOBILE_1: '' }
		const cgenvoi = w.C_Gen_Voiture || { VOI_MODELE: '', VOI_LIBELLE: '' }

		return {

			w: w,

			id: w.MIS_ID,
			passenger: get_name(w),
			tags: [],
			info: m.missions.find(m => m.w.MIS_ID == w.MIS_ID)?.information || "",
			debug: m.missions.find(m => m.w.MIS_ID == w.MIS_ID)?.debug || "",
			arrival: {
				estimated: eastr,
				remaining: "LOL",//ms_to_hm(ea.getTime() - new Date().getTime()).toString(),
			},
			pinned: false,
			locations: {
				cur: m.GetLocation(w.MIS_ID),
				from: w.C_Gen_EtapePresence[0].C_Geo_Lieu.LIE_LIBELLE,
				to: w.C_Gen_EtapePresence[1].C_Geo_Lieu.LIE_LIBELLE,
			},
			chauffeur_name: cgenchu.CHU_PRENOM + " " + cgenchu.CHU_NOM.toUpperCase(),
			chauffeur_phone: cgenchu.CHU_TEL_MOBILE_1,
			car_brand: cgenvoi.VOI_MODELE,
			license_plate: cgenvoi.VOI_LIBELLE,

			acc: e.acc
		};
	} catch (e) {

		return null;
	}
}

export function App() {
	const [search, setSearch] = useState<string>("");

	// const [tab, setTab] = useUrlState<string>('tab', 'tab_missions_to_hotel', validate_url_tab)
	const [increasedMiddleSize, setIncreasedMiddleSize] = useUrlState<boolean>(
		"all_missions",
		false,
		validate_url_size
	);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [loadingMsg, setLoadingMsg] = useState<string>(
		"Authentification ..."
	);

	const [isFailed, setIsFailed] = useState<boolean>(false);

	const [selected, setSelected] = useState(-1);

	const { instance } = useMsal();
	const token = useRef<any>(null)

	useEffect(() => {
		CarLocationManager.start();
		return () => CarLocationManager.destroy()
	}, [])

	const [allMissions, setAllMissions] = useState<MissionT[]>([]);

	const Refresh = async () => {

		setAllMissions(CarLocationManager.missions.map(e => waynium_to_missiont(
			e.w, CarLocationManager, e
		)).filter(e => e != null))

		console.log("RM - Refreshing missions");
		await CarLocationManager.Refresh()
		console.log("RM - Refreshed missions");

		setAllMissions(CarLocationManager.missions.map(e => waynium_to_missiont(
			e.w, CarLocationManager, e
		)).filter(e => e != null))

		console.log("RM - Miscount=", CarLocationManager.missions.length)
		console.log("RM - Locations=", CarLocationManager.locations)

		setIsLoading(false);
	}

	useEffect(() => {
		(async () => {
			const baseurl =
				"https://chabe-int-ca-api-habilitations.orangepond-bbd114b2.francecentral.azurecontainerapps.io";

			setLoadingMsg("En attente du Customer Portal...");

			let accessToken = "";
			try {
				const r = (await getAccessToken(instance))
				accessToken = r[0];
				token.current = r[1];

			} catch (e) {
				instance.loginRedirect(authconfig.loginRequest).catch((e) => {
					console.log(e);
				});
			}
			const response = await fetch(baseurl + "/api/v1/auth/me/adb2c", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}).then((e) => e.text());

			setLoadingMsg("Checking authorizations");

			const hab = Habilitation.parseHabilitationResponse(response);

			setLoadingMsg("Initializing");

			await CarLocationManager.Initialize(hab.subAccounts.map(e => ({
				limo: e.dispatch,
				name: "" + e.cliId
			})))

			setLoadingMsg("Done !");
			Refresh();
			setIsLoading(false);

		})();

	}, [instance]);

	useEffect(() => {
		const interval = setInterval(() => {
			setAllMissions(CarLocationManager.missions.map(e => waynium_to_missiont(
				e.w, CarLocationManager, e
			)).filter(e => e != null))
		}, 300);

		return () => clearInterval(interval);
	}, [])

	const [showAcc, setShowAcc] = useState(false);

	const incoming_missions = allMissions
		.filter(m => (showAcc && m.acc) || !m.acc)
	// .filter(m => m != null)
	// .filter((mission) => !mission.pinned)
	// .filter((m) => MissionFilter(m, search))
	// .filter((m) => showAcc ? true : m.w.MIS_SMI_ID != "7")
	// .filter(e => (
	// 	remaining_str_to_minutes(e.arrival.remaining) < 45
	// 	&& remaining_str_to_minutes(e.arrival.remaining) > 0
	// ))

	return (
		<>
			<div className="page">
				<nav id="navbar" className="navbar-chabe">
					<menu>
						<li>
							<a
								id="nav-dashboard"
								className="nav-link"
								href="https://agreeable-hill-038a64303.4.azurestaticapps.net/dashboard"
								aria-current="page"
							>
								<img
									src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/nav-home-icon.e0d99f32dc8c1b2787e29f865cbf6da1.svg"
									alt="Clickable Dashboard button side navigation bar"
								/>
							</a>
						</li>
						<li>
							<a
								id="nav-passenger"
								className="nav-link"
								href="https://agreeable-hill-038a64303.4.azurestaticapps.net/passenger"
							>
								<img
									src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/passenger-icon.c910ce52b2c01a277e279004e67c770e.svg"
									alt="Clickable Dashboard button side navigation bar"
								/>
							</a>
						</li>
						<li>
							<a
								id="nav-dashboard"
								className="nav-link is-active"
								href="/dashboard"
								aria-current="page"
							>
								<img
									src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/nav-home-icon.e0d99f32dc8c1b2787e29f865cbf6da1.svg"
									alt="Clickable Dashboard button side navigation bar"
								/>
							</a>
						</li>
					</menu>
					<img
						className="navbar-logo"
						src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/chabe-logo.d6fdbca61b47529a918259752dada744.svg"
						alt="Chabé logo side navigation bar"
					/>
				</nav>

				<div style={{ flex: "1", height: "100%" }}>
					{/* Header */}
					<div
						id="header"
						data-testid="header"
						className="header-chabe"
					>
						<div className="header-item d-flex justify-content-between">
							<li id="header-home" className="header-home">
								<img
									src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/logo-chabe.999d8b4d8a3a06fc5c11f4740d647335.svg"
									alt="Chabé logo header"
								/>
							</li>
							{/* <li>
								<div
									className="notifications"
									data-testid="notifications"
								>
									<div
										className="notifications__icon"
										id="notifications-icon-button"
										data-testid="notifications-icon-button"
										tabIndex={0}
									>
										<img
											src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/notification.810dac206be6943a4c4d743922becbde.svg"
											alt="bell"
										/>
									</div>
								</div>
							</li> */}
							<li>
								<div
									className="account-menu"
									data-testid="account-menu"
								>
									<div
										className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault account-avatar css-7yrfzp"
										id="btn-account-menu"
										data-testid="btn-account-menu"
										title={token?.current?.account?.name || "Aucun nom"}
									>
										{token?.current?.account?.idTokenClaims?.given_name?.[0] || ""}
										{token?.current?.account?.idTokenClaims?.family_name?.[0] || ""}
									</div>
								</div>
							</li>
						</div>
					</div>
					{/* End of Header */}

					<div
						style={{
							display: "flex",
							// height: "100%",
							// width: "100%",
							position:"absolute",
							left: 56,
							right:0,
							top:80,
							bottom:0
						}}
					>
						<div
							className="vertical-middle"
							style={{
								width: increasedMiddleSize
									? "100%"
									: undefined,
								transition: "width 0.5s",
							}}
						>
							<div className="midtitle">
								<h1
									style={{
										whiteSpace: "nowrap",
										overflow: increasedMiddleSize
											? "hidden"
											: undefined,
										fontFamily:
											"EuclidCircularA-Semibold,-apple-system,BlinkMacSystemFont,sans-serif",
									}}
								>
									{increasedMiddleSize
										? "Toutes les missions"
										: "Arrivées imminentes"}
									<ToggleButton
										value="check"
										selected={increasedMiddleSize}
										onChange={() =>
											setIncreasedMiddleSize(
												!increasedMiddleSize
											)
										}
										style={{
											marginLeft: 10,
											marginTop: 10,
											transform:
												"scale(0.8) translateY(-10px)",
											transition: "* 0.5s",
											fontFamily: "EuclidCircularA-Semibold",
										}}
									>
										{increasedMiddleSize
											? "Afficher les Arrivées imminentes"
											: "Afficher tout"}
									</ToggleButton>
									<br />
									<FormGroup>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												marginBottom: 10,
											}}
										>
											<Input
												style={{ flex: 1 }}
												placeholder="Rechercher"
												value={search}
												onChange={(e) =>
													setSearch(e.target.value)
												}
											/>
											<FormControlLabel
												control={
													<Switch
														checked={showAcc}
														onChange={(_, v) =>
															setShowAcc(v)
														}
													/>
												}
												label="Afficher les accueils"
											/>
										</div>
									</FormGroup>
								</h1>
							</div>

							{isFailed && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										height: "50%",
									}}
								>
									<Typography
										style={{
											marginTop: 10,
											textAlign: "center",

											color: "red",
										}}
									>
										Impossible de se connecter au serveur
										<br />
										<br />
										Nous vous prions de nous excuser pour la
										gêne occasionnée.
										<br />
										<div style={{ marginTop: 10 }}></div>
										<Button
											variant="contained"
											onClick={() => {
												window.location.reload();
											}}
										>
											Recharger la page
										</Button>
									</Typography>
								</div>
							)}

							{
								// No mission
								!increasedMiddleSize &&
								!isFailed &&
								!isLoading &&
								incoming_missions.length == 0 && (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "50%",
										}}
									>
										<Typography
											style={{
												marginTop: 10,
												textAlign: "center",
											}}
										>
											Aucune mission prévue pour les
											45 prochaines minutes !
											<div
												style={{ marginTop: 10 }}
											></div>
											<Button
												variant="contained"
												style={{
													borderRadius: 0,
													backgroundColor: "#001c40",
													boxShadow: "none",
												}}
												onClick={() => {
													setIncreasedMiddleSize(
														true
													);
												}}
											>
												Afficher toutes les missions
											</Button>
											<Button
												style={{
													color: "#001c40",
												}}
												onClick={() => {
													window.location.reload();
												}}
											>
												Actualiser la page
											</Button>
										</Typography>
									</div>
								)
							}

							{
								// Show loading spinner
								!increasedMiddleSize && isLoading && !isFailed && (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "50%",
										}}
									>
										<CircularProgress />
										<Typography style={{ marginTop: 10 }}>
											{loadingMsg}
										</Typography>
									</div>
								)
							}

							<div
								style={{ width: "100%" }}
								id="midscreencolorchangediv"
							>
								{!increasedMiddleSize && !isFailed && [

									// All other missions
									...incoming_missions
										.map((mission) => (
											<OneMission
												key={mission.id}
												mission={mission}
												onMissionChange={(mission) => {
													console.log(
														"Mission changed"
													);
													// updateOneMission(mission);
												}}
												index={mission.id}
												exp={selected == mission.id}
												onClicked={(_, mis) => {
													if (selected == mis.id)
														setSelected(-1);
													else setSelected(mis.id);
												}}
											/>
										)),
								]}
							</div>

							<div style={{ marginBottom: 50 }}></div>

							{increasedMiddleSize && !isFailed && (
								<div
									style={{
										marginTop: 10,
										height: "calc(100% - 160px)",
										// overflowY: "auto",
									}}
								>
									<TableContainer component={Paper} style={{ height: '100%' }}>
										<Table
											sx={{ minWidth: 650 }}
											aria-label="simple table"
											style={{ fontFamily: "EuclidCircularA-Regular" }}
										>
											<TableHead>
												<TableRow>
													<TableCell>
														<b>CLIENT</b>
													</TableCell>
													<TableCell align="right">
														<b>TIME</b>
													</TableCell>
													<TableCell align="right">
														<b>PICKUP</b>
													</TableCell>
													<TableCell align="right">
														<b>DROPOFF</b>
													</TableCell>
													<TableCell align="right">
														<b>DRIVER</b>
													</TableCell>
													<TableCell align="right">
														<b>STATUS</b>
													</TableCell>
													<TableCell align="right">
														<b>VEHICULE</b>
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody
												style={{
													height: "90%",
													overflow: 'auto'
												}}
											>
												{allMissions
													.filter(m => m != null)
													.filter(m => JSON.stringify(m).toLowerCase().indexOf(search.toLowerCase()) != -1)
													.sort((a, b) => {
														const a_date = new Date(new Date().toISOString().substring(0, 10) + "T" + a.arrival.estimated)
														const b_date = new Date(new Date().toISOString().substring(0, 10) + "T" + b.arrival.estimated)

														return a_date.getTime() - b_date.getTime()
													})
													.map((row, idx) => (
														<TableRow
															key={idx}
															sx={{
																"&:last-child td, &:last-child th":
																	{ border: 0 },
															}}
															style={{
																backgroundColor:
																	idx % 2 == 0
																		? "#f0f0f0"
																		: "white",
															}}
														>
															<TableCell
																component="th"
																scope="row"
															>
																{row.passenger}
															</TableCell>
															<TableCell align="left">
																{
																	row.w.MIS_HEURE_DEBUT
																} - <br />
																{
																	row.w.MIS_HEURE_FIN
																}
															</TableCell>
															<TableCell align="right">
																{row.locations.from}
															</TableCell>
															<TableCell align="right">
																{row.locations.to}
															</TableCell>
															<TableCell align="right">
																{row.chauffeur_name}
															</TableCell>
															<TableCell align="right">
																{
																	row.arrival
																		.remaining
																}
															</TableCell>
															<TableCell align="right">
																{row.license_plate}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							)}
						</div>
						<div className="vertical-right" style={{ color: 'white', height: '200', overflow: 'hidden' }}>
							<Wrapper
								apiKey={
									"AIzaSyC3xc8_oSX0dt2GENFpNnmzIFtn2IlfaCs"
								}
								libraries={["geometry", "core", "maps"]}
							>
								<MapEx>
									{
										incoming_missions
											.map((m, index) => {

												const mis = CarLocationManager.missions.find(e => e.w.MIS_ID == m.id)
												const loc = CarLocationManager.GetLocation(mis?.w.MIS_ID || -1)

												return (
													<CarLocEx
														showPath={
															m.id == selected
														}
														missionData={m}
														missionLastKnownPosition={null}
													/>
												)
											})
									}
								</MapEx>
								{/* <OverMapInformations /> */}
							</Wrapper>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export type LastKnownPositionInfo = {
	lat: number;
	lng: number;
	date: Date;
} | null;

export default App;
