import { LeftBar } from "../components/PageHome/LeftBar/LeftBar"
import { RightMap } from "../components/PageHome/RightMap"

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useMsal } from "@azure/msal-react"
import { useMsalToken } from "../hooks/useMsalToken"

const persister = createSyncStoragePersister({
    storage: window.localStorage,
})

function useMissions(token: string) {

    if(!token) {
        return { data: [] }
    }

    return useQuery({
        queryKey: ['missions'],
        queryFn: async (): Promise<Array<any>> => {

            const response = await fetch(
                'https://chabe-int-ca-api-habilitations.orangepond-bbd114b2.francecentral.azurecontainerapps.io/api/v1/auth/me/adb2c',
                {
                    headers: {
                        Authorization: `Bearer ${token || ''}`,
                    }
                })
            return await response.json()
        },
    })
}

export const PageHome = () => {

    const { instance } = useMsal()
    const { msalToken } = useMsalToken(instance)

    const queryClient = useQueryClient()
    const { data } = useMissions(msalToken?.token!)

    return (
        <>
            {JSON.stringify(data)}
            <LeftBar />
            <RightMap />
        </>
    )
}
