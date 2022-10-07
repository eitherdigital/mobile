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
import { CatalogType } from "../types";

function Catalog({
	setActiveModal,
	platform,
	setPopout,
	setRelease,
}: CatalogType) {
	const [selected, setSelected] =
		React.useState<"catalog" | "moderation">("catalog");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);
	const [releases, setReleases] = React.useState<ReleaseType[] | null>(null);
	const [moderation, setModeration] =
		React.useState<ReleaseType[] | null>(null);

	const getData = async () => {
		setIsLoading(true);
		try {
			const releases = await getReleases();
			if (releases.error) {
				setError(true);
				return;
			}
			setReleases(releases.releases);
			const moderation = await getModeration();
			setModeration(moderation.releases);
			setError(false);
		} catch {
			setError(true);
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
			if (releases.error) {
				setError(true);
				return;
			}
			setReleases(releases.releases);
			const moderation = await getModeration();
			setModeration(moderation.releases);
			setError(false);
		} catch {
			setError(true);
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
				{(!error && (
					<>
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
					</>
				)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
			</PullToRefresh>
		</>
	);
}

export default Catalog;
