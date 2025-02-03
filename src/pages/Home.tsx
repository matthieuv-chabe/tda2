
import { LeftBar } from "../components/PageHome/LeftBar/LeftBar"
import { RightMap } from "../components/PageHome/RightMap"

import { useMsal } from "@azure/msal-react"
import { useMsalToken } from "../hooks/useMsalToken"
import { useQuery } from '@tanstack/react-query'
import { Habilitation, HabilitationResponse } from "../core/habilitation"



function useMissions(token: string | undefined) {
    return useQuery({
        queryKey: ['missions'],
        queryFn: async (): Promise<Array<any>> => {
            if (!token) {
                console.error("No authentication token available")
                throw new Error("No authentication token available")
            };

            const response = await fetch(
                'https://chabe-int-ca-api-habilitations.orangepond-bbd114b2.francecentral.azurecontainerapps.io/api/v1/auth/me/adb2c',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return await response.json();
        },
        enabled: !!token, // Prevent query from running without a token
    });
}


export const PageHome = () => {

    const { instance } = useMsal()
    const { msalToken } = useMsalToken(instance)
    const { data } = useMissions(msalToken)

    return (
        <>
            {data && JSON.stringify(Habilitation.parseHabilitationResponse(JSON.stringify(data)))}
            <LeftBar />
            <RightMap />
        </>
    )
}
