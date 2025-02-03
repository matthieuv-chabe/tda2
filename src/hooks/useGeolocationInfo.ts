import { useQuery } from "@tanstack/react-query";
import type { paths } from "../../generated/openapi_geolocation"

type response = paths['/v1/geolocation/missions/tda']['post']['responses']['200']['content']['application/json']

export function useGeolocationInfo(wayniumMissionIds: string[]) {
    return useQuery<response>({
        queryKey: ['geolocations'],
        queryFn: async (): Promise<response> => {
            

            const response = await fetch(
                'http://localhost:3004/v1/geolocation/missions/tda',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "wayniumids": wayniumMissionIds.map(id => parseInt(id))
                    })
                }
            );

            if(!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json() as response;
        },
        enabled: wayniumMissionIds.length != 0, // Prevent query from running without a token
    });
}