import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { paths } from "../../../../generated/openapi"
import { useTranslation } from "react-i18next";

export const LeftBarBig = (props: {
    missions: paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"]
}) => {

    const { t } = useTranslation()

    return (
        <TableContainer component={Paper} style={{ overflowY: 'visible' }}>
            <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ fontFamily: "EuclidCircularA-Regular" }}
            >
                <TableHead
                    style={{
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                    }}
                >
                    <TableRow>
                        <TableCell>
                            <b>{t("ID")}</b>
                        </TableCell>
                        <TableCell>
                            <b>{t("passenger")}</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>{t("time")}</b>
                        </TableCell>
                        <TableCell align="right">
                            <b>{t("pickup")}</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>{t("dropoff")}</b>
                        </TableCell>
                        <TableCell align="right">
                            <b>{t("vehicle")}</b>
                        </TableCell>
                        <TableCell align="right">
                            <b>{t("driver")}</b>
                        </TableCell>
                        <TableCell align="right">
                            <b>{t("status")}</b>
                        </TableCell>

                    </TableRow>
                </TableHead>

                <TableBody
                    style={{
                        maxHeight: "60vh",
                        overflow: 'auto'
                    }}
                >
                    {props.missions
                        .map((row, idx) => (
                            <TableRow
                                key={idx}
                                sx={{
                                    "&:last-child td, &:last-child th":
                                        { border: 0 },
                                }}
                                style={{
                                    backgroundColor:
                                        idx % 2 == 0
                                            ? "#f0f0f0"
                                            : "white",
                                }}
                            >
                                <TableCell>
                                    {row.wayniumid}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    { /* Passengers */}
                                    {row.passengers[0]?.name || t("unknownPassenger")}
                                </TableCell>
                                <TableCell align="left">
                                    <div>
                                        {(row.startTime || "")?.substring(0, 5)}
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    {row.locations[0]?.name}
                                </TableCell>
                                <TableCell align="left">
                                    {row.locations[row.locations.length - 1]?.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.vehicle.plate} - {row.vehicle.brand}
                                </TableCell>
                                <TableCell align="right">
                                    {row.chauffeur.firstname}
                                    {row.chauffeur.lastname}
                                </TableCell>
                                <TableCell align="right">
                                    {/* {row.w.MIS_SMI_ID == "7" ? "Passager à bord" : "/"} */}
                                    {/* {t(parseStatusFromRequest(row.w))} */}
                                    {row.status}
                                </TableCell>

                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
