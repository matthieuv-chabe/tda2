
import { LeftBar } from "../components/PageHome/LeftBar/LeftBar"
import { RightMap } from "../components/PageHome/RightMap"

import { useMsal } from "@azure/msal-react"
import { useMsalToken } from "../hooks/useMsalToken"
import { useBsHabilitations } from "../hooks/useBsHabilitations"
import { useMissions } from "../hooks/useMissions"


export const PageHome = () => {

    const { instance } = useMsal()
    const { msalToken } = useMsalToken(instance)
    const { data: habilitation } = useBsHabilitations(msalToken)
    const { data: missions } = useMissions(habilitation?.subAccounts.filter(a => a.dispatch == 'chabe').map(a => ""+a.cliId) || [])

    return (
        <>
            <LeftBar missions={missions} />
            <RightMap />
        </>
    )
}
