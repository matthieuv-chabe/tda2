import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PublicClientApplication } from "@azure/msal-browser";

import { msalConfig } from "./authConfig";
import { MsalProvider } from "@azure/msal-react";
import AppAuth from "./mainAuth.tsx";
import { C } from "./Test.tsx";
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.body).render(
	<React.StrictMode>
		<MsalProvider instance={msalInstance}>
			<AppAuth />
			{/* <C /> */}
		</MsalProvider>
	</React.StrictMode>
);
