import { AuthenticationResult, IPublicClientApplication } from "@azure/msal-browser";
import { useEffect, useRef, useState } from "react";

export async function getAccessToken(instance: IPublicClientApplication) {
	const accessTokenRequest = {
		scopes: [
			`https://chabeazureb2cnpe.onmicrosoft.com/api-missions/user_access`,
		],
		account: instance.getAllAccounts()[0]!,
	};
	return instance
		.acquireTokenSilent(accessTokenRequest)
		.then((accessTokenResponse) => {
            return accessTokenResponse
			// return [accessTokenResponse.accessToken, accessTokenResponse] as const;
		});
}

export const useMsalToken = (msalInstance: IPublicClientApplication) => {
    
    const tokenRef = useRef<{ token: string; current: AuthenticationResult } | null>(null);
    const respRef = useRef<AuthenticationResult | null>(null);

    
    useEffect(() => {
        getAccessToken(msalInstance).then((resp) => {
            tokenRef.current = { token: resp.accessToken, current: resp };
            respRef.current = resp;
        });
    }, [msalInstance]);

    return { msalToken: tokenRef.current, msalResponse: respRef.current };

}
