import './App.css'

import { Wrapper } from '@googlemaps/react-wrapper'
import { Map } from './Components/Map'
import { CarLoc } from './Components/CarLoc/CarLoc'
import { Accordion, AccordionDetails, AccordionSummary, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, Typography } from '@mui/material'
import useUrlState from './core/utils/useUrlState';
import { ArrowForward } from '@mui/icons-material';
import { LicencePlate } from "./Components/MissionPanel/LicencePlate"
import { DriverName } from "./Components/MissionPanel/DriverName"

import { GeolocActualizer } from './Components/GeolocActualizer';
GeolocActualizer.hi();

// const validate_url_tab = (value: string) => ['tab_missions_to_hotel', 'tab_missions_from_hotel', 'tab_missions_done'].includes(value)
const validate_url_size = (value: string) => ['true', 'false'].includes(value)

function App() {

	// const [tab, setTab] = useUrlState<string>('tab', 'tab_missions_to_hotel', validate_url_tab)
	const [increasedMiddleSize, setIncreasedMiddleSize] = useUrlState<boolean>('all_missions', false, validate_url_size)

	let allMissions = []
	for (let i = 0; i < 50; i++) {
		allMissions.push(
			{
				client: 'M. DUPONT Jean',
				time: '15:00',
				pickup: 'AIRPORT CDG',
				dropoff: 'Hotel de la Paix',
				driver: 'Jean DUPONT',
				status: 'En cours',
				km: '25',
			}
		)
	};

	const calculate_increased_middle_size = () => {
		const viewport_width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
		if (viewport_width < 1000) {
			return "100%"
		}

		return "calc(100% - 500px)"
	}

	return (
		<>
			<div className="page">
				<nav
					id="navbar"
					className="navbar-chabe"
				>
					<menu>
						<li>
							<a id="nav-dashboard" className="nav-link is-active" href="/dashboard" aria-current="page">
								<img src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/nav-home-icon.e0d99f32dc8c1b2787e29f865cbf6da1.svg" alt="Clickable Dashboard button side navigation bar" />
							</a>
						</li>
						<li>
							<a id="nav-passenger" className="nav-link" href="/passenger">
								<img src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/passenger-icon.c910ce52b2c01a277e279004e67c770e.svg" alt="Clickable Dashboard button side navigation bar" />
							</a>
						</li>
					</menu>
					<img className="navbar-logo" src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/chabe-logo.d6fdbca61b47529a918259752dada744.svg" alt="Chabé logo side navigation bar" />
				</nav>
				{/* <div className="vertical-left">
					<div className="logo">
						<img src={chabeLogo} alt="React Logo" style={{ scale: .8 }} />
						<p>CHABE</p>
					</div>

					<div className="menu">
						<ul>

							<li className='active'>
								<div style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "25px",
								}}>
									<BsCarFront />
								</div>
								<a href="#">Realtime</a>
							</li>

							<li>
								<div style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "25px",
								}}>
									<BsReceipt />
								</div>
								<a href="#">
									Orders
									<LinkIcon style={{
										fontSize: 12,
										transform: 'translateY(2px) translateX(2px)',
										color: 'grey',
									}} />
								</a>
							</li>
						</ul>
					</div>

					<div></div>
					<div></div>
					<div></div>

					<div className="bottommenu">
						<li>
							<a href="#">
								<div style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}>
									<LogoutIcon />
								</div>
								<span>Logout</span>
							</a>
						</li>
					</div>

				</div> */}
				<div style={{ flex: '1', height: '100%' }}>

					{/* Header */}
					<div id="header" data-testid="header" className="header-chabe">
						<div className="header-item d-flex justify-content-between">
							<li id="header-home" className="header-home">
								<img src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/logo-chabe.999d8b4d8a3a06fc5c11f4740d647335.svg" alt="Chabé logo header" />
							</li>
							<li>
								<div>
									<div id="language-selector" data-testid="language-selector">
										<div className="component-dropdown-lang" data-testid="component-dropdown">
											<div className="custom-dropdown-lang">
												<label htmlFor="selectionDropdown" hidden>
													selectionDropdown
												</label>
												<div className="react-select-container-lang css-b62m3t-container" id="selectionDropdown">
													<span id="react-select-2-live-region" className="css-7pg0cj-a11yText">
													</span>
													<span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText">
													</span>
													<div className="react-select__control css-13cymwt-control">
														<div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
															<div className="react-select__single-value css-1dimb5e-singleValue">
																EN
															</div>
															<div className="react-select__input-container css-19bb58m" data-value="">
																<input
																	id="ipx"
																	className="react-select__input" autoCapitalize="none" autoComplete="off" autoCorrect="off"
																	spellCheck="false" tabIndex={0} type="text" aria-autocomplete="list" aria-expanded="false" aria-haspopup="true"
																	role="combobox" value=""
																	control-id="ControlID-1" />
															</div>
														</div>
														<div className="react-select__indicators css-1wy0on6">
															<span className="react-select__indicator-separator css-1u9des2-indicatorSeparator"></span>
															<div className="react-select__indicator react-select__dropdown-indicator css-1xc3v61-indicatorContainer" aria-hidden="true">
																<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-8mmkcg">
																	<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
																</svg>
															</div>
														</div>
													</div>
													<input name="car" type="hidden" value="en" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							<li>
								<div className="notifications" data-testid="notifications">
									<div className="notifications__icon" id="notifications-icon-button" data-testid="notifications-icon-button" tabIndex={0}>
										<img src="https://agreeable-hill-038a64303.4.azurestaticapps.net//static/media/notification.810dac206be6943a4c4d743922becbde.svg" alt="bell" />
									</div>
								</div>
							</li>
							<li>
								<div className="account-menu" data-testid="account-menu">
									<div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault account-avatar css-7yrfzp" id="btn-account-menu" data-testid="btn-account-menu">
										MV
													
									</div>
								</div>
							</li>
						</div>
					</div>
					{/* End of Header */}

					<div style={{ display:'flex', height: '100%', width: '100%' }}>
						<div
							className="vertical-middle"
							style={{
								width: increasedMiddleSize ? calculate_increased_middle_size() : "40%",
								transition: 'width 0.5s',
							}}
						>
							<div className="midtitle">
								<h1 style={{
									whiteSpace: "nowrap",
									overflow: (increasedMiddleSize ? "hidden" : undefined),
									fontFamily: 'EuclidCircularA-Semibold,-apple-system,BlinkMacSystemFont,sans-serif'
								}}
								>
									{
										increasedMiddleSize ?
											'Toutes les missions' :
											'Arrivées imminentes'
									}
									<ToggleButton
										value="check"
										selected={increasedMiddleSize}
										onChange={() => setIncreasedMiddleSize(!increasedMiddleSize)}
										style={{
											marginLeft: 10,
											marginTop: 10,
											transform: 'scale(0.8) translateY(-10px)',
											transition: '* 0.5s',
										}}
									>
										{
											increasedMiddleSize ?
												'Afficher les Arrivées imminentes' :
												'Afficher tout'
										}
									</ToggleButton>
								</h1>
							</div>



							{
								// !increasedMiddleSize && (
								// 	<>
								// 		<p style={{ marginTop: 15 }}>
								// 			<BsCarFront className="iconfix" />
								// 			<span className='livemissioncount'>7</span> missions en cours
								// 		</p>

								// 		<Tabs
								// 			value={tab}
								// 			onChange={(_e, v) => setTab(v)}
								// 			centered={true}
								// 			variant='fullWidth'
								// 		>
								// 			<Tab value="tab_missions_to_hotel" label="Vers Hotel" />
								// 			<Tab value="tab_missions_from_hotel" label="Depuis Hotel" />
								// 			<Tab value="tab_missions_done" label="Terminées" />
								// 		</Tabs>

								// 		{tab === 'tab_missions_to_hotel' && (
								// 			<div className="mission"
								// 				style={{
								// 					marginTop: 10,
								// 					height: 'calc(100% - 10px)',
								// 					overflowY: 'scroll',
								// 				}}
								// 			>
								// 				<MissionLeftPanel isVip={true} />
								// 				<MissionLeftPanel />
								// 				<MissionLeftPanel noLocation />
								// 				<MissionLeftPanel />
								// 			</div>
								// 		)}
								// 	</>
								// )
							}

							{!increasedMiddleSize && (
								<>
									<Accordion style={{background: '#f5f5f5'}}>
										<AccordionSummary
										>
											<div style={{ width: "100%" }}>
												<div
													style={{
														display: "flex",
														flexDirection: "row",
														alignItems: "center",
														marginBottom: 10,

														// 5px space between chips
														gap: 5,
													}}
												>
													<Chip
														label="VIP"
														style={{ border: 'solid gold 2px' }}
														size='small'
													/>

													<Chip
														label="PMR"
														size='small'
													/>

													<Chip
														label="5 bagages"
														size='small'
													/>
												</div>

												<div style={{
													display: "flex",
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-evenly",
													marginBottom: 10,
													width: "100%",
												}}>
													<div>
														<Typography variant="h5" component="div">
															Arrivée à 15h00
														</Typography>
														<Typography sx={{ mb: 1.5 }} color="text.secondary">
															Dans 2h 30min
														</Typography>
													</div>

													<div>
														<Typography variant="h6" component="div">
															M. DUPONT Jean
														</Typography>
														<Typography sx={{ mb: 1.5 }} color="text.secondary">
															+33 6 12 34 56 78
														</Typography>
													</div>
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

												<div style={{ textAlign: "center" }}>
													<Typography>Aéroport CDG</Typography>
													<Typography variant='subtitle2'>12:00</Typography>
												</div>

												<div>
													<ArrowForward />
												</div>

												<div style={{ textAlign: "center" }}>
													<Typography>Hotel de la Paix</Typography>
													<Typography variant='subtitle2'>15:00</Typography>
												</div>

											</div>

											<div style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-evenly",
												marginTop: 10,

												backgroundColor: "#f5f5f5",
												padding: 10,
												borderRadius: 10,
												boxShadow: "0 0 5px 0 rgba(10,10,10,0.2)",
											}}>
												<div style={{
													textAlign: "center",
												}}>
													Mercedes S<br />
													<LicencePlate platenum="AA-000-FF" />
												</div>
												<DriverName name="M. Macho FEUR" />
											</div>


										</AccordionDetails>
									</Accordion>
								</>
							)}



							{increasedMiddleSize && (
								<div style={{
									marginTop: 10,
									height: 'calc(100% - 10px)',
									overflowY: 'scroll',
								}}>
									<TableContainer component={Paper}>
										<Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell>Client</TableCell>
													<TableCell align="right">Time</TableCell>
													<TableCell align="right">Pickup</TableCell>
													<TableCell align="right">Dropoff</TableCell>
													<TableCell align="right">Driver</TableCell>
													<TableCell align="right">Status</TableCell>
													<TableCell align="right">Km</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{allMissions.map((row) => (
													<TableRow
														key={row.client}
														sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
													>
														<TableCell component="th" scope="row">
															{row.client}
														</TableCell>
														<TableCell align="right">{row.time}</TableCell>
														<TableCell align="right">{row.pickup}</TableCell>
														<TableCell align="right">{row.dropoff}</TableCell>
														<TableCell align="right">{row.driver}</TableCell>
														<TableCell align="right">{row.status}</TableCell>
														<TableCell align="right">{row.km}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							)}

						</div>
						<div className="vertical-right">
							<Wrapper apiKey={'AIzaSyC3xc8_oSX0dt2GENFpNnmzIFtn2IlfaCs'} libraries={['geometry', 'core', 'maps']}>
								<Map>
									<CarLoc position={{ lat: 48.8534, lng: 2.3488 }} />
								</Map>
								{/* <OverMapInformations /> */}
							</Wrapper>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
