import { useQuery } from "@tanstack/react-query";
import type { paths } from "../../generated/openapi"

type response = paths['/v1/missions/filter']['post']['responses']['200']['content']['application/json']

export function useMissions(wayniumclientids: string[]) {
    return useQuery<response>({
        queryKey: ['missions'],
        queryFn: async (): Promise<Array<any>> => {
            

            const response = await fetch(
                'http://localhost:2999/v1/missions/filter',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        "dayFrom": "2025-02-03",
                        "dayTo": "2025-02-03",
                        "clientWayniumId": wayniumclientids,
                        "limit": 1000,
                        "offset": 0
                    })
                }
            );

            if(!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json() as response;
        },
        enabled: wayniumclientids.length != 0, // Prevent query from running without a token
    });
}