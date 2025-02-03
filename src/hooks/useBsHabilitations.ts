import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { useMsalToken } from "./useMsalToken";

const baseurl = "https://chabe-int-ca-api-habilitations.orangepond-bbd114b2.francecentral.azurecontainerapps.io";

export const useBsHabilitations = () => {

    const { instance } = useMsal();
    const { msalToken } = useMsalToken(instance)

}
