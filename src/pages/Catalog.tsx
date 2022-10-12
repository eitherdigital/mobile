import React, { ChangeEvent } from "react";
import {
	PanelHeader,
	ScreenSpinner,
	PullToRefresh,
	Group,
	Search,
	SegmentedControl,
	Div,
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
	const [searched, setSearched] = React.useState<ReleaseType[] | null>(null);

	const [searchValue, setSearchValue] = React.useState<string>("");

	const getData = async () => {
		setIsLoading(true);
		try {
			setSearchValue("");
			setSearched(null);
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

	React.useEffect(() => {
		setPopout(isLoading && <ScreenSpinner state="loading" />);
	}, [isLoading]);

	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const onRefresh = React.useCallback(async () => {
		setIsRefreshing(true);
		try {
			setSearchValue("");
			setSearched(null);
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

	const onSearch = (e?: ChangeEvent<HTMLInputElement>) => {
		const value = e ? e.target.value : searchValue;
		if (e) {
			setSearchValue(value);
		}
		if (value.trim() === "") {
			setSearched(null);
			return;
		}
		let searched: ReleaseType[] = [];
		let releasesData = selected === "catalog" ? releases : moderation;
		if (!releasesData) return;
		for (const release of releasesData) {
			if (
				release.title.toLowerCase().includes(value.trim().toLowerCase()) ||
				release.artists.toLowerCase().includes(value.trim().toLowerCase()) ||
				release.copyright?.toLowerCase().includes(value.trim().toLowerCase()) ||
				release.upc?.toLowerCase().includes(value.trim().toLowerCase())
			) {
				searched.push(release);
			}
		}

		setSearched(searched);
	};

	return (
		<>
			<PanelHeader>Каталог</PanelHeader>

			<Group>
				<Div>
					<SegmentedControl
						onChange={(value) =>
							setSelected(
								value === "catalog" || value === "moderation"
									? value
									: "catalog"
							)
						}
						value={selected}
						options={[
							{
								label: "Релизы",
								value: "catalog",
							},
							{
								label: "Модерация",
								value: "moderation",
							},
						]}
					/>
				</Div>
				<Search value={searchValue} onChange={onSearch} />
			</Group>

			<PullToRefresh isFetching={isRefreshing} onRefresh={onRefresh}>
				{(!error && (
					<>
						{(searched === null && (
							<>
								{(selected === "catalog" && (
									<Group>
										{releases !== null && (
											<>
												{(releases.length === 0 && (
													<NoData caption="Релизов не найдено" />
												)) || (
													<>
														{releases.map((release: ReleaseType, key) => (
															<Release
																refreshReleases={getData}
																release={release}
																platform={platform}
																setPopout={setPopout}
																setRelease={setRelease}
																setActiveModal={setActiveModal}
																key={key}
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
														{moderation.map((release: ReleaseType, key) => (
															<Release
																key={key}
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
						)) || (
							<Group>
								{(searched?.length === 0 && (
									<NoData caption="Релизов не найдено" />
								)) || (
									<>
										{searched?.map((release: ReleaseType, key) => (
											<Release
												key={key}
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
							</Group>
						)}
					</>
				)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
			</PullToRefresh>
		</>
	);
}

export default Catalog;
