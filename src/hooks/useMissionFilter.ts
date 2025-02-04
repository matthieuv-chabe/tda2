
import { paths } from "../../generated/openapi"
type Mission = paths["/v1/missions/filter"]["post"]["responses"]["200"]["content"]["application/json"][number]

export const useMissionFilter = ( { data }: { data: Mission[] } ) => {

    return data
        // .filter(m => (m.status < 8) && (m.status > 4)) // 8 = mission completed, 0 = mission canceled or no information
}
