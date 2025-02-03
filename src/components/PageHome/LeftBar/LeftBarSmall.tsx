import { Button, Typography } from "@mui/material"
import { paths } from "../../../../generated/openapi"
import { OneMission } from "./OneMission"
import { useTranslation } from "react-i18next"

export const LeftBarSmall = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
}) => {

    if (props.missions.length == 0) {
        return <LeftBarNoMission />
    }

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
