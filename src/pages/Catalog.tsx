import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	PullToRefresh,
	TabsItem,
	Tabs,
	Group,
} from "@vkontakte/vkui";
import { getModeration, getReleases } from "../hooks/Api";
import NoData from "../components/NoData";
import Release, { ReleaseType } from "../components/Release";

function Catalog({ setActiveModal, platform, setPopout, setRelease }: any) {
	const [selected, setSelected] =
		React.useState<"catalog" | "moderation">("catalog");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [releases, setReleases] = React.useState<any>(null);
	const [moderation, setModeration] = React.useState<any>(null);

	const getData = async () => {
		setIsLoading(true);
		try {
			const releases = await getReleases();
			setReleases(releases.releases);
			const moderation = await getModeration();
			setModeration(moderation.releases);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		getData();
	}, []);

	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const onRefresh = React.useCallback(async () => {
		setIsRefreshing(true);

		try {
			const releases = await getReleases();
			setReleases(releases.releases);
			const moderation = await getModeration();
			setModeration(moderation.releases);
		} finally {
			setIsRefreshing(false);
		}
	}, []);

	return (
		<>
			{isLoading && <ScreenSpinner state="loading" />}
			<PanelHeader>Каталог</PanelHeader>

			<Tabs>
				<TabsItem
					selected={selected === "catalog"}
					onClick={() => {
						setSelected("catalog");
					}}
				>
					Релизы
				</TabsItem>
				<TabsItem
					selected={selected === "moderation"}
					onClick={() => {
						setSelected("moderation");
					}}
				>
					Модерация
				</TabsItem>
			</Tabs>
			<PullToRefresh isFetching={isRefreshing} onRefresh={onRefresh}>
				{(selected === "catalog" && (
					<Group>
						{releases !== null && (
							<>
								{(releases.length === 0 && (
									<NoData caption="Релизов не найдено" />
								)) || (
									<>
										{releases.map((release: ReleaseType) => (
											<Release
												refreshReleases={getData}
												release={release}
												platform={platform}
												setPopout={setPopout}
												setRelease={setRelease}
												setActiveModal={setActiveModal}
											/>
										))}
									</>
								)}
							</>
						)}
					</Group>
				)) || (
					<Group>
						{moderation !== null && (
							<>
								{(moderation.length === 0 && (
									<NoData caption="Релизов не найдено" />
								)) || (
									<>
										{moderation.map((release: ReleaseType) => (
											<Release
												refreshReleases={getData}
												release={release}
												platform={platform}
												setPopout={setPopout}
												setRelease={setRelease}
												setActiveModal={setActiveModal}
											/>
										))}
									</>
								)}
							</>
						)}
					</Group>
				)}
			</PullToRefresh>
		</>
	);
}

export default Catalog;
