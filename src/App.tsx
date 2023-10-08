import { useState } from 'react'
import chabeLogo from '../public/logo_chabe_blanc_200.png'
import './App.css'

import { BsCarFront, BsReceipt } from 'react-icons/bs'
import LogoutIcon from '@mui/icons-material/Logout';
import LinkIcon from '@mui/icons-material/Link';

import { Wrapper } from '@googlemaps/react-wrapper'
import { Map } from './Components/Map'
import { CarLoc } from './Components/CarLoc/CarLoc'
import { Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, ToggleButton } from '@mui/material'
import { MissionLeftPanel } from './Components/MissionPanel/MissionLeftPanel'

function App() {

	const fx = (google: any) => {
		console.log(google)
	}

	const [tab, setTab] = useState('one')
	const [increasedMiddleSize, setIncreasedMiddleSize] = useState(false)

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

	return (
		<>
			<div className="page">
				<div className="vertical-left">
					<div className="logo">
						<img src={chabeLogo} alt="React Logo" />
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

							<li>Portfolio</li>
							<li>Blog</li>
							<li>Contact</li>
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
						width: increasedMiddleSize ? 'calc(100% - 500px)' : undefined,
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
							<p style={{ marginTop: 15 }}>
								<BsCarFront className="iconfix" />
								<span className='livemissioncount'>7</span> missions en cours
							</p>

							<Tabs
								value={tab}
								onChange={(e, v) => setTab(v)}
							>
								<Tab value="one" label="Vers Hotel" />
								<Tab value="two" label="Depuis Hotel" />
								<Tab value="three" label="Terminées" />
							</Tabs>

							{tab === 'one' && (
								<div className="mission"
									style={{
										marginTop: 10,
										height: 'calc(100% - 10px)',
										overflowY: 'scroll',
									}}
								>
									<MissionLeftPanel />
									<MissionLeftPanel />
									<MissionLeftPanel />
									<MissionLeftPanel />
								</div>
							)}
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
