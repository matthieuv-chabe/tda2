import { Accordion, AccordionSummary } from "@mui/material"
import { paths } from "../../../../generated/openapi"
import { useTranslation } from "react-i18next"
import { useUserSelectionContext } from "../RightMap/UserSelectionContext"

export const OneMission = (props: {
    mission: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][0]
}) => {

    const userselection = useUserSelectionContext();    

    const { t } = useTranslation()
    const passenger_text = props.mission.passengers[0]?.name || <p style={{color: 'grey'}}>{t("unknownPassenger")}</p>

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
                        <div title={""+props.mission.id}>
                            <p>
                                {passenger_text}
                            </p>
                        </div>

                        <div>
                            {props.mission.startTime}
                        </div>  

                        <div>
                            {props.mission.status}
                        </div>

                        <div>
                            {props.mission.id}-{props.mission.wayniumid}
                        </div>


                    </div>
                </div>
            </AccordionSummary>
        </Accordion>
    )

}
