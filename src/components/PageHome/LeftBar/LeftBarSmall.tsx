import { Button, Typography } from "@mui/material"
import { paths } from "../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../generated/openapi_geolocation"
import { OneMission } from "./OneMission/OneMission"
import { useTranslation } from "react-i18next"
import { searchValueInObject } from "../../../core/searchValueInObject"
import { useUserSelectionContext } from "../RightMap/UserSelectionContext"

export const LeftBarSmall = (props: {
	missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"],
	geolocations: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json']

}) => {

	const userSelection = useUserSelectionContext()

	const missions_to_show = props.missions
		.filter(m => m.type == "A_TO_B")
		.filter((m) => {
			// Text filter rules
			return (searchValueInObject(m, userSelection.textfilter || ""))
		})
		.map(m => ({
			...m,
			eta: (props.geolocations.find(g => g.mission.wayniumid === m.wayniumid)?.mission?.eta) as unknown as string || ""
		}))

	if (missions_to_show.length == 0) {
		return <LeftBarNoMission />
	}

	return (
		<>
			<div
				style={{ width: "100%" }}
				id="midscreencolorchangediv"
			>
				{
					missions_to_show
						?.sort((a, b) => new Date(b.eta).getTime() || 0 - new Date(a.eta).getTime() || 0)
						.map((mission) => {
							const matching_geolocation = props.geolocations.find(g => g.mission.wayniumid === mission.wayniumid)
							return (
								<OneMission key={mission.id} mission={mission} geolocation={matching_geolocation} />
							)
						})
				}
			</div>
		</>
	)
}

const LeftBarNoMission = () => {

	const { t } = useTranslation()

	return (
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
				{t("noMissions")}

				<div
					style={{ marginTop: 10 }}
				></div>
				<Button
					style={{
						color: "#001c40",
					}}
					onClick={() => {
						window.location.reload();
					}}
				>
					{t("refreshPage")}
				</Button>
			</Typography>
		</div>
	)
}
