import {
	Alert,
	calcInitialsAvatarColor,
	CellButton,
	Gradient,
	Group,
	Header,
	InfoRow,
	InitialsAvatar,
	PanelHeader,
	PanelHeaderBack,
	Separator,
	SimpleCell,
	Title,
} from "@vkontakte/vkui";
import React from "react";
import { deleteSubaccount } from "../../hooks/Api";
import { UserData } from "../../hooks/Auth";
import { getInitials } from "../../hooks/Helpers";

function Subaccount({
	setActiveView,
	subaccount,
	setPopout,
}: {
	setActiveView: any;
	subaccount: UserData | null;
	setPopout: any;
}) {
	const onClose = () => {
		setActiveView("subaccounts");
	};

	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				{subaccount?.name}
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
					gradientColor={calcInitialsAvatarColor(
						subaccount?.id ? subaccount.id : 1
					)}
					size={96}
				>
					{getInitials(subaccount?.name ? subaccount.name : "Загрузка")}
				</InitialsAvatar>
				<Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
					{subaccount?.name}
				</Title>
			</Gradient>
			<Separator />
			<Group header={<Header mode="secondary">Информация</Header>}>
				<SimpleCell>
					<InfoRow header="Логин">{subaccount?.username}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Email">{subaccount?.email}</InfoRow>
				</SimpleCell>
				<CellButton
					onClick={() => {
						setPopout(
							<Alert
								actions={[
									{
										title: "Отмена",
										autoclose: true,
										mode: "cancel",
									},
									{
										title: "Удалить",
										autoclose: true,
										mode: "destructive",
										action: async () => {
											if (!subaccount) return;
											await deleteSubaccount(subaccount.id);
											setActiveView("subaccounts");
										},
									},
								]}
								actionsLayout="horizontal"
								onClose={() => {
									setPopout(null);
								}}
								header="Удаление аккаунта"
								text="Вы уверены, что хотите удалить этот аккаунт?"
							/>
						);
					}}
					mode="danger"
				>
					Удалить аккаунт
				</CellButton>
			</Group>
		</>
	);
}

export default Subaccount;
