import {
	Avatar,
	Gradient,
	Group,
	PanelHeader,
	PanelHeaderBack,
	Separator,
	SimpleCell,
	Text,
} from "@vkontakte/vkui";
import React from "react";
import { openLink } from "../../hooks/Helpers";
import Icon from "../../assets/images/icon.png";

function About({ setActiveView }: { setActiveView: any }) {
	const onClose = () => setActiveView("settings");

	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				О приложении
			</PanelHeader>

			<Gradient
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					padding: 32,
				}}
			>
				<Avatar src={Icon} size={96} />
				<Text
					style={{
						marginBottom: 8,
						marginTop: 20,
						color: "var(--vkui--color_text_secondary)",
					}}
				>
					Версия {window.localStorage.getItem("app-version") || "unknown"}
				</Text>
			</Gradient>
			<Separator />
			<Group>
				<SimpleCell
					onClick={() => {
						openLink("mailto:mobile@either.digital");
					}}
				>
					Обратная связь
				</SimpleCell>
				<SimpleCell
					onClick={() => {
						openLink(
							"https://play.google.com/store/apps/details?id=digital.either.app"
						);
					}}
				>
					Оценить приложение
				</SimpleCell>
			</Group>
		</>
	);
}

export default About;
