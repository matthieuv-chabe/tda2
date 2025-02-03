import { paths } from "../../../../generated/openapi"
import { OneMission } from "./OneMission"

export const LeftBarSmall = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
}) => {


    return (
        <>
            <div
                style={{ width: "100%" }}
                id="midscreencolorchangediv"
            >
                {props.missions?.map((mission) => (
                    <OneMission key={mission.id} mission={mission} />
                ))}
            </div>
        </>
    )
}
