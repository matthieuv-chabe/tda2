
import { LeftBar } from "../components/PageHome/LeftBar/LeftBar"
import { RightMap } from "../components/PageHome/RightMap/RightMap"

import { useMsal } from "@azure/msal-react"
import { useMsalToken } from "../hooks/useMsalToken"
import { useBsHabilitations } from "../hooks/useBsHabilitations"
import { useMissions } from "../hooks/useMissions"
import { useGeolocationInfo } from "../hooks/useGeolocationInfo"
import UserSelectionContext, { UserSelectionContextType } from "../components/PageHome/RightMap/UserSelectionContext"
import { useState } from "react"
import { useMissionFilter } from "../hooks/useMissionFilter"


export const PageHome = () => {

    const { instance } = useMsal()
    const { msalToken } = useMsalToken(instance)
    const { data: habilitation } = useBsHabilitations(msalToken)
    const { data: missions } = useMissions(habilitation?.subAccounts.filter(a => a.dispatch == 'chabe').map(a => ""+a.cliId) || [])
    const filteredMissions = useMissionFilter({data: missions || []})
    const { data: geoloc} = useGeolocationInfo(filteredMissions?.map(m => m.wayniumid) || [])

    const [userSelectionContext, setUserSelectionContext] = useState<any>({
        hasUserMovedMap: false,
        selectedMission: null,
        textFilter: "",
    });
    const setHasUserMovedMap = (hasUserMovedMap: boolean) => { setUserSelectionContext({...userSelectionContext, hasUserMovedMap: hasUserMovedMap}) }
    const setSelectedMission = (missionId: number) => {
        // Scroll to the mission
        document.getElementById("OneMission-"+missionId)?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        setUserSelectionContext({...userSelectionContext, selectedMission: missionId})
        // Reset the map movement state
        setHasUserMovedMap(false)
    }

    return (
        <UserSelectionContext.Provider value={{...userSelectionContext, setSelectedMission, setHasUserMovedMap}}>
            <LeftBar missions={filteredMissions || []} />
            <RightMap missions={filteredMissions || []} geolocations={geoloc || []} />
        </UserSelectionContext.Provider>
    )
}
