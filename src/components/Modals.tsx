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
	Icon28CopyOutline,
	Icon28DoneOutline,
} from "@vkontakte/icons";
import { Icon28ChevronRightOutline } from "@vkontakte/icons";
import NoData from "./NoData";
import { openLink } from "../hooks/Helpers";
import { ModalsType } from "../types";

function Modals({
	activeModal,
	onClose,
	platform,
	isMobile,
	release,
}: ModalsType) {
	const [copied, setCopied] = React.useState<boolean>(false);

	const releaseInfo = () => (
		<ModalPage
			id={"release_info"}
			onClose={onClose}
			dynamicContentHeight
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
				<SimpleCell
					onClick={
						release?.upc
							? () => {
									if (copied) return;
									if (!release.upc) return;
									navigator.clipboard.writeText(release.upc);
									setCopied(true);
									setTimeout(() => {
										setCopied(false);
									}, 2000);
							  }
							: undefined
					}
					after={
						release?.upc ? (
							copied ? (
								<Icon28DoneOutline />
							) : (
								<Icon28CopyOutline />
							)
						) : undefined
					}
				>
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
								if (release.apple) openLink(release.apple);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Apple Music
						</SimpleCell>
					)}
					{release?.deezer && (
						<SimpleCell
							onClick={() => {
								if (release.deezer) openLink(release.deezer);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Deezer
						</SimpleCell>
					)}
					{release?.spotify && (
						<SimpleCell
							onClick={() => {
								if (release.spotify) openLink(release.spotify);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Spotify
						</SimpleCell>
					)}
					{release?.vk_music && (
						<SimpleCell
							onClick={() => {
								if (release.vk_music) openLink(release.vk_music);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							VK Музыка
						</SimpleCell>
					)}
					{release?.yandex && (
						<SimpleCell
							onClick={() => {
								if (release.yandex) openLink(release.yandex);
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
			{releaseInfo()}
			{releasePlatforms()}
		</ModalRoot>
	);
}

export default Modals;
