import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
	ConfigProvider,
	AdaptivityProvider,
	AppRoot,
	WebviewType,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { getTheme } from "./hooks/Theme";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<ConfigProvider appearance={getTheme()} webviewType={WebviewType.INTERNAL}>
		<AdaptivityProvider>
			<AppRoot>
				<App />
			</AppRoot>
		</AdaptivityProvider>
	</ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
