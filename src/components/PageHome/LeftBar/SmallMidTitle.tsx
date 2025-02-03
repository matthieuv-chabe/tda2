import { FormControlLabel, FormGroup, Input, Switch, ToggleButton } from "@mui/material"
import { useTranslation } from "react-i18next"

const MidTitleWithSearch = (props: {}) => {

    const { t } = useTranslation()


    // Placeholders for DEBUG
    let search = ""
    let showAcc = false
    let showClosed = false
    let setSearch = (e: any) => { }
    let setShowAcc = (e: any) => { }
    let setShowClosed = (e: any) => { }

    return (
        <>
            <FormGroup>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Input
                        style={{ flex: 1 }}
                        placeholder={t("search")}
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                defaultChecked={showAcc}
                                onChange={(e) =>
                                    setShowAcc(e)
                                }
                            />
                        }
                        label={t("showGreetings")}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showClosed}
                                onChange={(e, v) =>
                                    setShowClosed(e)
                                }
                            />
                        }
                        label={t("showCompletedMissions")}
                    />

                </div>
            </FormGroup>

        </>
    )
}

export const MidTitle = (props: {
    increasedMiddleSize: boolean,
    setIncreasedMiddleSize: (increasedMiddleSize: boolean) => void,
}) => {

    const { t } = useTranslation()

    return (
        <div className="midtitle">
            <div style={{ marginBottom: 10 }}>
                <ToggleButton
                    className="toggle-button"
                    value="check"
                    title={props.increasedMiddleSize
                        ? t("showImminentArrivals")
                        : t("showAllMissions")}
                    selected={props.increasedMiddleSize}
                    onChange={() =>
                        props.setIncreasedMiddleSize(
                            !props.increasedMiddleSize
                        )
                    }
                    style={{
                        marginTop: 10,
                        transition: "* 0.5s",
                        fontFamily: "EuclidCircularA-Semibold",

                        borderRadius: 0,
                        backgroundColor: "#001c40",
                        color: 'white'
                    }}
                >
                    {props.increasedMiddleSize
                        ? t("showImminentArrivals")
                        : t("showAllMissions")}
                </ToggleButton>
            </div>
            <h1
                style={{
                    whiteSpace: "nowrap",
                    overflow: props.increasedMiddleSize
                        ? "hidden"
                        : undefined,
                    fontFamily:
                        "EuclidCircularA-Semibold,-apple-system,BlinkMacSystemFont,sans-serif",
                }}
            >
                {props.increasedMiddleSize
                    ? t("allMissions")
                    : t("imminentArrivals")}
                <br />

                {props.increasedMiddleSize && <MidTitleWithSearch />}

            </h1>
        </div>
    )
}