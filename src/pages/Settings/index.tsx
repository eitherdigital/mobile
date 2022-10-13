import {
	Icon28HelpCircleOutline,
	Icon28InfoCircleOutline,
	Icon28KeyOutline,
	Icon28UserAddOutline,
	Icon28UserStarBadgeOutline,
} from "@vkontakte/icons";
import {
	Title,
	calcInitialsAvatarColor,
	Gradient,
	InitialsAvatar,
	PanelHeader,
	PanelHeaderBack,
	Separator,
	Group,
	Header,
	SimpleCell,
	CellButton,
} from "@vkontakte/vkui";
import React from "react";
import { getUser, logout } from "../../hooks/Auth";
import { getInitials, openLink } from "../../hooks/Helpers";

function Settings({ setActiveView }: { setActiveView: any }) {
	const user = getUser();

	const onClose = () => setActiveView("dashboardPage");

	return (
		<>
			<PanelHeader before={<PanelHeaderBack onClick={onClose} />}>
				Настройки
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
				<InitialsAvatar
					gradientColor={calcInitialsAvatarColor(user?.id ? user.id : 1)}
					size={96}
				>
					{getInitials(user?.name ? user.name : "Загрузка")}
				</InitialsAvatar>
				<Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
					{user?.name}
				</Title>
			</Gradient>

			<Separator />

			<Group header={<Header mode="secondary">Настройки</Header>}>
				{user?.status === "admin" && (
					<SimpleCell
						expandable
						onClick={() => {
							setActiveView("admin_settings");
						}}
						before={<Icon28UserStarBadgeOutline />}
					>
						Настройки администратора
					</SimpleCell>
				)}
				<SimpleCell
					expandable
					onClick={() => {
						setActiveView("change_password");
					}}
					before={<Icon28KeyOutline />}
				>
					Сменить пароль
				</SimpleCell>
				{!user?.isSubkabinet && (
					<SimpleCell
						expandable
						onClick={() => {
							setActiveView("subaccounts");
						}}
						before={<Icon28UserAddOutline />}
					>
						Субкабинеты
					</SimpleCell>
				)}
				{window.localStorage.getItem("app-theme") && (
					<SimpleCell
						expandable
						onClick={() => {
							setActiveView("about");
						}}
						before={<Icon28InfoCircleOutline />}
					>
						О приложении
					</SimpleCell>
				)}
				<SimpleCell
					expandable
					onClick={() => {
						openLink("mailto:mobile@either.digital");
					}}
					before={<Icon28HelpCircleOutline />}
				>
					Помощь
				</SimpleCell>
				<CellButton onClick={logout} mode="danger">
					Выйти из аккаунта
				</CellButton>
			</Group>
		</>
	);
}

export default Settings;
