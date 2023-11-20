import chabeLogo from '../public/logo_chabe_blanc_200.png'
import './App.css'

import { BsCarFront, BsReceipt } from 'react-icons/bs'
import LogoutIcon from '@mui/icons-material/Logout';
import LinkIcon from '@mui/icons-material/Link';

import { Wrapper } from '@googlemaps/react-wrapper'
import { Map } from './Components/Map'
import { CarLoc } from './Components/CarLoc/CarLoc'
import { Accordion, AccordionDetails, AccordionSummary, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, Typography } from '@mui/material'
import useUrlState from './core/utils/useUrlState';
import { ArrowForward } from '@mui/icons-material';
import { LicencePlate } from "./Components/MissionPanel/LicencePlate"
import { DriverName } from "./Components/MissionPanel/DriverName"

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
				<div className="vertical-left">
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

				</div>
				<div
					className="vertical-middle"
					style={{
						width: increasedMiddleSize ? calculate_increased_middle_size() : undefined,
						transition: 'width 0.5s',
					}}
				>
					<div className="midtitle">
						<h1 style={{ whiteSpace: "nowrap", overflow: (increasedMiddleSize ? "hidden" : undefined) }}>
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



					{!increasedMiddleSize && (
						<>
							{/* <p style={{ marginTop: 15 }}>
								<BsCarFront className="iconfix" />
								<span className='livemissioncount'>7</span> missions en cours
							</p> */}

							{/* <Tabs
								value={tab}
								onChange={(_e, v) => setTab(v)}
								centered={true}
								variant='fullWidth'
							>
								<Tab value="tab_missions_to_hotel" label="Vers Hotel" />
								<Tab value="tab_missions_from_hotel" label="Depuis Hotel" />
								<Tab value="tab_missions_done" label="Terminées" />
							</Tabs>

							{tab === 'tab_missions_to_hotel' && (
								<div className="mission"
									style={{
										marginTop: 10,
										height: 'calc(100% - 10px)',
										overflowY: 'scroll',
									}}
								>
									<MissionLeftPanel isVip={true} />
									<MissionLeftPanel />
									<MissionLeftPanel noLocation />
									<MissionLeftPanel />
								</div>
							)} */}
						</>
					)}

					{!increasedMiddleSize && (
						<>
							<Accordion>
								<AccordionSummary
								>
									<div style={{width: "100%"}}>
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
							<Accordion>
								<AccordionSummary
								>
									<div style={{width: "100%"}}>
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

										<div>
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
										<div>
											Mercedes Classe S<br />
											<LicencePlate platenum="AA-000-FF" />
										</div>
										<DriverName name="M. Macho FEUR" /><br />
									</div>


								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
								>
									<div style={{width: "100%"}}>
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

										<div>
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
										Mercedes Classe S<LicencePlate platenum="AA-000-FF" />
										<DriverName name="M. Macho FEUR" /><br />
									</div>


								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
								>
									<div style={{width: "100%"}}>
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

										<div>
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
										Mercedes Classe S<LicencePlate platenum="AA-000-FF" />
										<DriverName name="M. Macho FEUR" /><br />
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
		</>
	)
}

export default App
