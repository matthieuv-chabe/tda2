import { Accordion, AccordionSummary } from "@mui/material"
import { paths } from "../../../../../generated/openapi"
import { paths as geolocpaths } from "../../../../../generated/openapi_geolocation"
import { useTranslation } from "react-i18next"
import { useUserSelectionContext } from "../../RightMap/UserSelectionContext"
import { Eta } from "./Eta"

export const OneMission = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number],
    geolocation?: geolocpaths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json'][number]
}) => {

    const userselection = useUserSelectionContext();    
    const { t } = useTranslation()

    if(!props.geolocation) return null;
    
    const passenger_text = props.mission.passengers[0]?.name
        ? <p>{props.mission.passengers[0]?.name}</p>
        : <p style={{color: 'grey'}}>{t("unknownPassenger")}</p>

    const eta_text = props.geolocation?.mission.eta ?
        <p>{new Date(props.geolocation?.mission.eta as unknown as string).toLocaleTimeString()}</p>
        : <p style={{color: 'grey'}}>{t("unknownETA")}</p>

    return (
        <Accordion
            expanded={userselection.selectedMission == props.mission.id}
            onChange={(_, expanded) => {if(expanded) userselection.setSelectedMission(props.mission.id); else userselection.setSelectedMission(0)}}
            style={{ width: "100%" }}
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
                        <div style={{flex: 1}} title={""+props.mission.id}>
                            {passenger_text}
                        </div>

                        <div style={{flex: 1}}>
                            {/* {props.mission.startTime}- */}
                            <Eta geolocation={props.geolocation} />
                        </div>  

                        <div style={{flex: 1}}>
                            {props.mission.status}
                        </div>

                        <div style={{flex: 1}}>
                            {props.mission.id}-{props.mission.wayniumid}-T{props.mission.type}
                        </div>


                    </div>
                </div>
            </AccordionSummary>
        </Accordion>
    )

}
