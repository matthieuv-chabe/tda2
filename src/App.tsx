import "./App.css";

import * as process from "process"

import { Wrapper } from "@googlemaps/react-wrapper";
import { Map } from "./Components/Map";
import { CarLoc } from "./Components/CarLoc/CarLoc";
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
import { useEffect, useState } from "react";
import {
	random_car,
	random_firstname,
	random_lastname,
	random_tags,
} from "./random";
import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { Habilitation } from "./Habilitation";
import axios from "axios";
import { Retry } from "./Retry";
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
			return accessTokenResponse.accessToken;
		});
}

export type MissionT = {
	id: number;
	passenger: string;
	tags: string[];
	arrival: {
		estimated: string;
		remaining: string;
	};
	pinned: boolean;
	locations: {
		from: string;
		to: string;
	};
	chauffeur_name: string;
	chauffeur_phone: string;
	car_brand: string;
	license_plate: string;
};

function MissionFilter(mission: MissionT, search: string) {
	if (search === "") {
		return true;
	}

	const fulltext = JSON.stringify(mission).toLowerCase();
	return fulltext.includes(search.toLowerCase());
}

const fake_missions = true
	// && (process.env.DISABLE_AUTH_FOR_NONLOCAL == 'true')
	&& (window.location.hostname.indexOf('localhost') == -1) // If NOT localhost


export function App() {
	const [search, setSearch] = useState<string>("");


	// const [tab, setTab] = useUrlState<string>('tab', 'tab_missions_to_hotel', validate_url_tab)
	const [increasedMiddleSize, setIncreasedMiddleSize] = useUrlState<boolean>(
		"all_missions",
		false,
		validate_url_size
	);


	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [loadingMsg, setLoadingMsg] = useState<string>("Authentification ...");

	// let allMissions = [];
	// for (let i = 0; i < 10; i++) {
	// 	allMissions.push({
	// 		passenger: "M. DUPONT Jean",
	// 		tags: ["VIP", "PMR", "5 bagages"],
	// 		arrival: {
	// 			estimated: "15h00",
	// 			remaining: "2h 30min",
	// 		},
	// 		pinned: false,
	// 		locations: {
	// 			from: "Aéroport CDG",
	// 			to: "Hotel de la Paix",
	// 		},
	// 		chauffeur_name: "M. Macho FEUR",
	// 		chauffeur_phone: "+33 6 12 34 56 78",
	// 		car_brand: "Mercedes S",
	// 		license_plate: "AA-000-FF",
	// 	});
	// }


	const [allMissions, setAllMissions] = useState<MissionT[]>(
		Array.from({ length: (fake_missions ? 10 : 0) }, (_, i) => ({
			id: i,
			passenger: `${random_lastname()} ${random_firstname()}`,
			tags: random_tags(),
			arrival: {
				estimated: "15h00",
				remaining: "2h 30min",
			},
			pinned: false,
			locations: {
				from: "Aéroport CDG",
				to: "Hotel de la Paix",
			},
			chauffeur_name: "M. Macho FEUR",
			chauffeur_phone: "+33 6 12 34 56 78",
			car_brand: random_car(),
			license_plate: "AA-000-FF",
		}))
	);
	const updateOneMission = (mission: MissionT) => {
		setAllMissions((prev) =>
			prev.map((m) => (m.id === mission.id ? mission : m))
		);
	};

	const calculate_increased_middle_size = () => {
		const viewport_width = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		if (viewport_width < 800) {
			return "100%";
		}

		return "calc(100% - 500px)";
	};

	const { instance } = useMsal();

	useEffect(() => {

		if (fake_missions) return;

		(async () => {
			const baseurl =
				"https://chabe-int-ca-api-habilitations.orangepond-bbd114b2.francecentral.azurecontainerapps.io";

			const accessToken = await getAccessToken(instance);
			const response = await fetch(baseurl + "/api/v1/auth/me/adb2c", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}).then(e => e.text())

			setLoadingMsg("Checking authorizations")

			const hab = Habilitation.parseHabilitationResponse(response);
			let client_ids = [hab.cliId, hab.subAccounts.map(a => a.cliId)]

			setLoadingMsg("Retrieving mission informations");

			const client_ids_string = client_ids.join(',')



			const url = 'https://chabe-api-management-dev.azure-api.net/chabe-services/waynium/getMissionsWithSpecificWhereClause?dispatch=chabe';
			const options = {
				method: 'PUT',
				headers: {
					'content-type': 'application/json',
					'Ocp-Apim-Subscription-Key': '246724d1e066440bb428e88393f0d4a4'
				},
				body: `{"nf_gen_mission":"MIS_COM_ID IN (SELECT COM_ID FROM nf_com_commande WHERE COM_CLI_ID IN (${client_ids_string}))"}`,
			} as RequestInit;

			try {
				const response = await fetch(url, options);
				const data = await response.json();

				setLoadingMsg(JSON.stringify(data));


			} catch (error) {
				console.error(error);
			}

		})();
	}, [instance]);

	return (
		<>
			<div className="page">
				<nav id="navbar" className="navbar-chabe">
					<menu>
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
						<li>
							<a
								id="nav-passenger"
								className="nav-link"
								href="/passenger"
							>
								<img
									src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/passenger-icon.c910ce52b2c01a277e279004e67c770e.svg"
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
							<li>
								{/* <div>
									<div
										id="language-selector"
										data-testid="language-selector"
									>
										<div
											className="component-dropdown-lang"
											data-testid="component-dropdown"
										>
											<div className="custom-dropdown-lang">
												<label
													htmlFor="selectionDropdown"
													hidden
												>
													selectionDropdown
												</label>
												<div
													className="react-select-container-lang css-b62m3t-container"
													id="selectionDropdown"
												>
													<span
														id="react-select-2-live-region"
														className="css-7pg0cj-a11yText"
													></span>
													<span
														aria-live="polite"
														aria-atomic="false"
														aria-relevant="additions text"
														className="css-7pg0cj-a11yText"
													></span>
													<div className="react-select__control css-13cymwt-control">
														<div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
															<div className="react-select__single-value css-1dimb5e-singleValue">
																EN
															</div>
															<div
																className="react-select__input-container css-19bb58m"
																data-value=""
															>
																<input
																	id="ipx"
																	className="react-select__input"
																	autoCapitalize="none"
																	autoComplete="off"
																	autoCorrect="off"
																	spellCheck="false"
																	tabIndex={0}
																	type="text"
																	aria-autocomplete="list"
																	aria-expanded="false"
																	aria-haspopup="true"
																	role="combobox"
																	value=""
																	control-id="ControlID-1"
																/>
															</div>
														</div>
														<div className="react-select__indicators css-1wy0on6">
															<span className="react-select__indicator-separator css-1u9des2-indicatorSeparator"></span>
															<div
																className="react-select__indicator react-select__dropdown-indicator css-1xc3v61-indicatorContainer"
																aria-hidden="true"
															>
																<svg
																	height="20"
																	width="20"
																	viewBox="0 0 20 20"
																	aria-hidden="true"
																	focusable="false"
																	className="css-8mmkcg"
																>
																	<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
																</svg>
															</div>
														</div>
													</div>
													<input
														name="car"
														type="hidden"
														value="en"
													/>
												</div>
											</div>
										</div>
									</div>
								</div> */}
							</li>
							<li>
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
							</li>
							<li>
								<div
									className="account-menu"
									data-testid="account-menu"
								>
									<div
										className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault account-avatar css-7yrfzp"
										id="btn-account-menu"
										data-testid="btn-account-menu"
									>
										MV
									</div>
									<div>
										<Button onClick={async () => {
											const retry = new Retry("test");
											retry.add(() => {
												throw "fail 1"
											}).add(() => {
												throw "fail 2"
											}).add(() => {
												window.location.reload();
											}).add(() => {
												console.log("ok !")
											}).run()
										}
										}>
											Lol
										</Button>
									</div>
								</div>
							</li>
						</div>
					</div>
					{/* End of Header */}

					<div
						style={{
							display: "flex",
							height: "100%",
							width: "100%",
						}}
					>
						<div
							className="vertical-middle"
							style={{
								width: increasedMiddleSize
									? calculate_increased_middle_size()
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
													<Switch defaultChecked />
												}
												label="Afficher les accueils"
											/>
										</div>
									</FormGroup>
								</h1>
							</div>

							{
								!increasedMiddleSize && allMissions.length === 0 && (
									<div style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										height: "50%",
									}}>
										<CircularProgress />
										<Typography style={{ marginTop: 10 }}>
											{loadingMsg}
										</Typography>
									</div>
								)
							}

							{!increasedMiddleSize && [
								// Pinned missions should be at the top
								...allMissions
									.filter((mission) => mission.pinned)
									.filter((m) => MissionFilter(m, search))
									.map((mission) => (
										<OneMission
											mission={mission}
											onMissionChange={(mission) => {
												console.log("Mission changed");
												updateOneMission(mission);
											}}
										/>
									)),

								// All other missions
								...allMissions
									.filter((mission) => !mission.pinned)
									.filter((m) => MissionFilter(m, search))
									.map((mission) => (
										<OneMission
											mission={mission}
											onMissionChange={(mission) => {
												console.log("Mission changed");
												updateOneMission(mission);
											}}
										/>
									)),
							]}

							{increasedMiddleSize && (
								<div
									style={{
										marginTop: 10,
										height: "calc(100% - 10px)",
										overflowY: "scroll",
									}}
								>
									<TableContainer component={Paper}>
										<Table
											stickyHeader
											sx={{ minWidth: 650 }}
											aria-label="simple table"
										>
											<TableHead>
												<TableRow>
													<TableCell>
														Client
													</TableCell>
													<TableCell align="right">
														Time
													</TableCell>
													<TableCell align="right">
														Pickup
													</TableCell>
													<TableCell align="right">
														Dropoff
													</TableCell>
													<TableCell align="right">
														Driver
													</TableCell>
													<TableCell align="right">
														Status
													</TableCell>
													<TableCell align="right">
														Km
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{allMissions.map((row) => (
													<TableRow
														key={row.passenger}
														sx={{
															"&:last-child td, &:last-child th":
																{ border: 0 },
														}}
													>
														<TableCell
															component="th"
															scope="row"
														>
															{row.passenger}
														</TableCell>
														<TableCell align="right">
															{
																row.arrival
																	.estimated
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
						<div className="vertical-right">
							<Wrapper
								apiKey={
									"AIzaSyC3xc8_oSX0dt2GENFpNnmzIFtn2IlfaCs"
								}
								libraries={["geometry", "core", "maps"]}
							>
								<Map>
									<CarLoc
										position={{ lat: 48.8534, lng: 2.3488 }}
									/>
								</Map>
								{/* <OverMapInformations /> */}
							</Wrapper>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
