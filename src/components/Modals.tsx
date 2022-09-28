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
	InfoRow,
	Textarea,
	FormItem,
} from "@vkontakte/vkui";
import {
	Icon24Dismiss,
	Icon28SwitchOutline,
	Icon28Profile,
} from "@vkontakte/icons";
import { getUser } from "../hooks/Auth";
import { Icon28ChevronRightOutline } from "@vkontakte/icons";
import NoData from "./NoData";

function Modals({ activeModal, onClose, platform, isMobile, release }: any) {
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
	const releaseInfo = () => (
		<ModalPage
			id={"release_info"}
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
					{release?.title}
				</ModalPageHeader>
			}
		>
			<SimpleCell>
				<InfoRow header="Обложка">
					<Avatar
						mode="image"
						src={`https://api.either.digital${release?.cover}`}
						size={128}
					/>
				</InfoRow>
			</SimpleCell>
			<Group
				header={
					<>
						<Separator />
						<Header mode="secondary">Информация о релизе</Header>
					</>
				}
			>
				<SimpleCell>
					<InfoRow header="Название релиза">{release?.title}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Версия">{release?.version || "Н/А"}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Исполнитель">{release?.artists}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Тип релиза">{release?.type}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="UPC">{release?.upc || "Н/А"}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Жанр">{release?.genre}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Дата релиза">{release?.date}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Дата предзаказа">
						{release?.preorder_date || "Н/А"}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={<Header mode="secondary">Дополнительная информация</Header>}
			>
				<SimpleCell>
					<InfoRow header="Название лейбла">
						{release?.copyright || "Н/А"}
					</InfoRow>
				</SimpleCell>
				<AdaptivityProvider>
					<SimpleCell
						Component="label"
						after={
							<Switch
								disabled
								defaultChecked={release?.premiere_for_russia ? true : false}
							/>
						}
					>
						Ранний старт в России
					</SimpleCell>
				</AdaptivityProvider>
				<AdaptivityProvider>
					<SimpleCell
						Component="label"
						after={
							<Switch
								disabled
								defaultChecked={release?.realtime ? true : false}
							/>
						}
					>
						Доставка в реальном времени
					</SimpleCell>
				</AdaptivityProvider>
			</Group>
			<Group>
				<FormItem top="Сообщение для модератора">
					<Textarea readOnly defaultValue={release?.comment || ""} />
				</FormItem>
			</Group>
		</ModalPage>
	);
	const openLink = (link: string) => {
		let a = document.createElement("a");
		a.target = "_blank";
		a.href = link;
		a.click();
	};
	const releasePlatforms = () => {
		let noPlatforms = false;
		if (
			!release?.apple &&
			!release?.deezer &&
			!release?.spotify &&
			!release?.vk_music &&
			!release?.yandex
		) {
			noPlatforms = true;
		}
		return (
			<ModalPage
				id={"release_platforms"}
				onClose={onClose}
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
						Список платформ
					</ModalPageHeader>
				}
			>
				<Group>
					{noPlatforms && <NoData caption="Платформ сейчас не найдено" />}
					{release?.apple && (
						<SimpleCell
							onClick={() => {
								openLink(release.apple);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Apple Music
						</SimpleCell>
					)}
					{release?.deezer && (
						<SimpleCell
							onClick={() => {
								openLink(release.deezer);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Deezer
						</SimpleCell>
					)}
					{release?.spotify && (
						<SimpleCell
							onClick={() => {
								openLink(release.spotify);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Spotify
						</SimpleCell>
					)}
					{release?.vk_music && (
						<SimpleCell
							onClick={() => {
								openLink(release.vk_music);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							VK Музыка
						</SimpleCell>
					)}
					{release?.yandex && (
						<SimpleCell
							onClick={() => {
								openLink(release.yandex);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Яндекс Музыка
						</SimpleCell>
					)}
				</Group>
			</ModalPage>
		);
	};

	return (
		<ModalRoot activeModal={activeModal} onClose={onClose}>
			{Settings()}
			{releaseInfo()}
			{releasePlatforms()}
		</ModalRoot>
	);
}

export default Modals;
