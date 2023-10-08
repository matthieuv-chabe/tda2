import { Card, CardContent, Chip, Avatar, Typography, CardActions, Button } from "@mui/material"
import { LicencePlate } from "./LicencePlate"
import { DriverName } from "./DriverName"
import { GeolocLostIcon } from "../GeolocLostIcon"

export const MissionLeftPanel = () => {
    return (<>

        <Card sx={{ minWidth: 275 }} style={{ marginTop: 5 }}>
            
            <CardContent style={{position: "relative"}}>
                <div
                    style={{
                        position: "absolute",
                        top: 55,
                        right: 0,
                    }}
                >
                    <GeolocLostIcon />
                </div>

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
                        avatar={<Avatar style={{backgroundColor: "gold"}}>VIP</Avatar>}
                        label="M. DUPONT Jean"
                        style={{ border: 'solid gold 2px' }}
                        size='small'
                    />

                    <Chip
                        label="PMR"
                        style={{ backgroundColor: 'orange' }}
                        size='small'
                    />

                    <Chip
                        label="5 luggages"
                        style={{ backgroundColor: 'lightgreen' }}
                        size='small'
                    />
                </div>

                <Typography variant="h5" component="div">
                    ETA 15:00
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Arrival in 15 minutes
                </Typography>
                <Typography variant="body2">
                    Mercedes S-Class <LicencePlate platenum="AA-000-FF" /> <br />
                    <br />
                    Driver : <DriverName name="Jean DUPONT" /><br />
                    Departure: AIRPORT CDG 14:00 <br />
                </Typography>
            </CardContent>
            <CardActions>
                <Button>Show on map</Button>
            </CardActions>
        </Card>

    </>)
}
