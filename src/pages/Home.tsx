
import { useState } from "react"
import { LeftBar } from "../components/PageHome/LeftBar/LeftBar"
import { RightMap } from "../components/PageHome/RightMap/RightMap"
import { useMsal } from "@azure/msal-react"
import { useMsalToken } from "../hooks/useMsalToken"
import { useBsHabilitations } from "../hooks/useBsHabilitations"
import { useMissions } from "../hooks/useMissions"
import { useGeolocationInfo } from "../hooks/useGeolocationInfo"
import UserSelectionContext from "../components/PageHome/RightMap/UserSelectionContext"
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
        textfilter: "",
    });
    const setHasUserMovedMap = (hasUserMovedMap: boolean)       => { setUserSelectionContext({...userSelectionContext, hasUserMovedMap: hasUserMovedMap         }) }
    const setTextFilter = (textfilter: string)                  => { setUserSelectionContext({...userSelectionContext, textfilter: textfilter                   }) }
    const setOnlyShowCancelled = (onlyShowCancelled: boolean)   => { setUserSelectionContext({...userSelectionContext, onlyShowCancelled: onlyShowCancelled     }) }
    const setOnlyShowMeetGreets = (onlyShowMeetGreets: boolean) => { setUserSelectionContext({...userSelectionContext, onlyShowMeetGreets: onlyShowMeetGreets   }) }
    const setSelectedMission = (missionId: number) => {
        // Scroll to the mission
        document.getElementById("OneMission-"+missionId)?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        // Update the state with the newly selected item and reset the map move flag
        setUserSelectionContext({...userSelectionContext, selectedMission: missionId, hasUserMovedMap: false})
    }

    return (
        <UserSelectionContext.Provider value={{...userSelectionContext, setSelectedMission, setHasUserMovedMap, setTextFilter, setOnlyShowCancelled, setOnlyShowMeetGreets}}>
            <LeftBar missions={filteredMissions || []} />
            <RightMap missions={filteredMissions || []} geolocations={geoloc || []} />
        </UserSelectionContext.Provider>
    )
}
