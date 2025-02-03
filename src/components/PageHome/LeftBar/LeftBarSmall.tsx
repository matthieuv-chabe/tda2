import { paths } from "../../../../generated/openapi"
import { OneMission } from "./OneMission"

export const LeftBarSmall = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
}) => {

    const missions_to_show = props.missions?.filter(m => m.status < 8) // >8 is completed

    return (
        <>
        {missions_to_show?.length}
            <div
                style={{ width: "100%" }}
                id="midscreencolorchangediv"
            >
                {missions_to_show?.map((mission) => (
                    <OneMission key={mission.id} mission={mission} />
                ))}
            </div>
        </>
    )
}
