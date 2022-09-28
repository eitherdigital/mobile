import React from "react";
import {
	SimpleCell,
	Avatar,
	ActionSheet,
	ActionSheetItem,
	ActionSheetDefaultIosCloseItem,
	IOS,
	Alert,
} from "@vkontakte/vkui";
import {
	Icon24MoreHorizontal,
	Icon28DeleteOutline,
	Icon28DeleteOutlineAndroid,
	Icon28InfoCircleOutline,
	Icon28CubeBoxOutline,
} from "@vkontakte/icons";
import { deleteRelease } from "../hooks/Api";

export type ReleaseType = {
	id: number;
	title: string;
	artists: string;
	cover: string;
	status: "ok" | "moderation";
};

function Release({
	release,
	platform,
	setPopout,
	refreshReleases,
	setActiveModal,
	setRelease,
}: {
	release: ReleaseType;
	platform: any;
	setPopout: any;
	refreshReleases: any;
	setActiveModal: any;
	setRelease: any;
}) {
	const onClose = () => setPopout(null);

	const openDeletion = () => {
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
							await deleteRelease(release.id);
							await refreshReleases();
						},
					},
				]}
				actionsLayout="horizontal"
				onClose={onClose}
				header="Удаление релиза"
				text="Вы уверены, что хотите удалить этот релиз?"
			/>
		);
	};
	const openMenu = () =>
		setPopout(
			<ActionSheet
				onClose={onClose}
				iosCloseItem={<ActionSheetDefaultIosCloseItem />}
			>
				<ActionSheetItem
					autoclose
					onClick={() => {
						setRelease(release);
						setActiveModal("release_info");
					}}
					before={<Icon28InfoCircleOutline />}
				>
					Информация о релизе
				</ActionSheetItem>

				{release.status === "ok" && (
					<ActionSheetItem
						onClick={() => {
							setRelease(release);
							setActiveModal("release_platforms");
						}}
						autoclose
						before={<Icon28CubeBoxOutline />}
					>
						Список платформ
					</ActionSheetItem>
				)}

				{release.status === "ok" && (
					<ActionSheetItem
						onClick={openDeletion}
						autoclose
						before={
							platform === IOS ? (
								<Icon28DeleteOutline />
							) : (
								<Icon28DeleteOutlineAndroid />
							)
						}
						mode="destructive"
					>
						Удалить релиз
					</ActionSheetItem>
				)}
			</ActionSheet>
		);
	return (
		<SimpleCell
			before={
				<Avatar
					mode="image"
					src={`https://image.either.digital/resize?image=https://api.either.digital${release.cover}&w=120&h=120`}
				/>
			}
			onClick={openMenu}
			subtitle={release.artists}
			after={<Icon24MoreHorizontal fill="var(--vkui--color_icon_accent)" />}
		>
			{release.title}
		</SimpleCell>
	);
}

export default Release;
