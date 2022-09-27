import React from "react";
import {
	ModalPage,
	IOS,
	ModalPageHeader,
	PanelHeaderButton,
	PanelHeaderClose,
	ANDROID,
	ModalRoot,
	Avatar,
	Title,
	Gradient,
	AdaptivityProvider,
	SimpleCell,
	Switch,
	Group,
	Header,
	Separator,
} from "@vkontakte/vkui";
import {
	Icon24Dismiss,
	Icon28SwitchOutline,
	Icon28Profile,
} from "@vkontakte/icons";
import { getUser } from "../hooks/Auth";

function Modals({ activeModal, onClose, platform, isMobile }: any) {
	const Settings = () => {
		const user = getUser();
		return (
			<ModalPage
				id={"settings"}
				onClose={onClose}
				settlingHeight={100}
				hideCloseButton={platform === IOS}
				header={
					<ModalPageHeader
						before={
							isMobile &&
							platform === ANDROID && <PanelHeaderClose onClick={onClose} />
						}
						after={
							platform === IOS && (
								<PanelHeaderButton onClick={onClose}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
					>
						Настройки
					</ModalPageHeader>
				}
			>
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
					<Avatar size={96}>
						<Icon28Profile width={96} height={96} />
					</Avatar>
					<Title
						style={{ marginBottom: 8, marginTop: 20 }}
						level="2"
						weight="2"
					>
						{user?.name}
					</Title>
				</Gradient>

				<Separator />

				<Group header={<Header mode="secondary">Настройки</Header>}>
					<AdaptivityProvider>
						<SimpleCell
							before={<Icon28SwitchOutline />}
							Component="label"
							after={<Switch />}
						>
							Switch
						</SimpleCell>
					</AdaptivityProvider>
				</Group>
			</ModalPage>
		);
	};
	return (
		<ModalRoot activeModal={activeModal} onClose={onClose}>
			{Settings()}
		</ModalRoot>
	);
}

export default Modals;
