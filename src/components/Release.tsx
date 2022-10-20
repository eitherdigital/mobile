import React from "react";
import {
	SimpleCell,
	Avatar,
	ActionSheet,
	ActionSheetItem,
	ActionSheetDefaultIosCloseItem,
	IOS,
	Alert,
	ScreenSpinner,
} from "@vkontakte/vkui";
import {
	Icon24MoreHorizontal,
	Icon28DeleteOutline,
	Icon28DeleteOutlineAndroid,
	Icon28InfoCircleOutline,
	Icon28CubeBoxOutline,
	Icon24LinkedOutline,
} from "@vkontakte/icons";
import { deleteRelease, getPromoLink } from "../hooks/Api";
import { getUser } from "../hooks/Auth";
import { openLink } from "../hooks/Helpers";
import { ReleaseComponentType } from "../types";
import { getSettings } from "../hooks/Settings";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

export type ReleaseType = {
	id: number;
	user_id: number;
	cover: string;
	title: string;
	artists: string;
	version?: string;
	genre: string;
	date: string;
	type: string;
	comment?: string;
	upc?: string;
	status: string;
	created_at: string;
	updated_at: string;
	copyright?: string;
	preorder_date?: string;
	premiere_for_russia: number;
	realtime: number;
	apple?: string;
	yandex?: string;
	spotify?: string;
	vk_music?: string;
	deezer?: string;
};

function Release({
	release,
	platform,
	setPopout,
	refreshReleases,
	setActiveModal,
	setRelease,
}: ReleaseComponentType) {
	const onClose = () => setPopout(null);
	const user = getUser();

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

	const openPromolink = async () => {
		setPopout(<ScreenSpinner state="loading" />);
		try {
			if (!release.upc) {
				setPopout(<ScreenSpinner state="error" />);
				setTimeout(() => {
					setPopout(null);
				}, 1000);
				return;
			}
			const link = await getPromoLink(release.upc);

			if (!link) {
				setPopout(<ScreenSpinner state="error" />);
				setTimeout(() => {
					setPopout(null);
				}, 1000);
			} else {
				openLink(link as string);
				setPopout(null);
			}
		} catch {
			setPopout(<ScreenSpinner state="error" />);
			setTimeout(() => {
				setPopout(null);
			}, 1000);
		}
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

				{!user?.isSubkabinet && (
					<>
						{release.status === "ok" && (
							<ActionSheetItem
								onClick={openPromolink}
								autoclose
								before={<Icon24LinkedOutline width={28} height={28} />}
							>
								Перейти к промо-ссылке
							</ActionSheetItem>
						)}
					</>
				)}

				{!user?.isSubkabinet && (
					<>
						{release.status === "ok" && getSettings().apiType === "user" && (
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
					</>
				)}
			</ActionSheet>
		);
	return (
		<SimpleCell
			before={
				<LazyLoadImage
					src={`https://image.either.digital/resize?image=https://api.either.digital${release.cover}&w=120&h=120`}
					width="48px"
					height="48px"
					style={{
						borderRadius: 4,
						border: "1px solid var(--vkui--color_image_placeholder_alpha)",
						objectFit: "cover",
					}}
					wrapperClassName="vkuiAvatar Avatar vkuiAvatar--type-image Avatar--type-image vkuiAvatar--sz-48 Avatar--sz-48 vkuiAvatar--shadow Avatar--shadow"
					effect="opacity"
				/>
				// <Avatar
				// 	mode="image"
				// 	src={`https://image.either.digital/resize?image=https://api.either.digital${release.cover}&w=120&h=120`}
				// />
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
