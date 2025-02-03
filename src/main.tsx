import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import { PublicClientApplication } from "@azure/msal-browser";

import { msalConfig } from "./authConfig.ts";
import { MsalProvider } from "@azure/msal-react";
import AppAuth from "./mainAuth.tsx";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const msalInstance = new PublicClientApplication(msalConfig);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

ReactDOM.createRoot(document.body).render(
	<React.StrictMode>
		<MsalProvider instance={msalInstance}>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider
					theme={{
						token: {
							colorPrimary: "rgb(0, 28, 64)",
						}
					}}
				>
					<AppAuth />
				</ConfigProvider>
			</QueryClientProvider>
		</MsalProvider>
	</React.StrictMode>
);
