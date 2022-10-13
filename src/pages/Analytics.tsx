import React from "react";
import {
	getDateStreams,
	getReleases,
	getStreams,
	getTopReleases,
} from "../hooks/Api";
import {
	PanelHeader,
	ScreenSpinner,
	PullToRefresh,
	FormItem,
	Group,
	SimpleCell,
	Counter,
	Header,
	CardGrid,
	ContentCard,
	Root,
	View,
	Panel,
	List,
	Cell,
	SelectMimicry,
	Search,
	PanelHeaderBack,
} from "@vkontakte/vkui";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import NoData from "../components/NoData";
import { DateStreamType, TopReleaseType } from "../types";
import { Icon24Done } from "@vkontakte/icons";

function Analytics() {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom" as const,
				display: false,
			},
			title: {
				display: false,
				text: "Analytics",
			},
		},
	};
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);
	const [activeView, setActiveView] = React.useState<string>("analyticsPage");
	const [search, setSearch] = React.useState<string>("");
	const [searched, setSearched] =
		React.useState<{ value: string; label: string }[] | null>(null);

	const [releases, setReleases] =
		React.useState<{ value: string; label: string }[] | null>(null);
	const [release, setRelease] = React.useState<{
		value: string;
		label: string;
	}>({ value: "all", label: "Все релизы" });

	const [allStreams, setAllStreams] = React.useState<number>(0);
	const [payStreams, setPayStreams] = React.useState<number>(0);

	const [dateStreams, setDateStreams] =
		React.useState<DateStreamType | null>(null);
	const [topReleases, setTopReleases] =
		React.useState<TopReleaseType[] | null>(null);

	React.useEffect(() => {
		const getData = async () => {
			try {
				setIsLoading(true);
				if (!releases) {
					const releases = await getReleases();
					if (releases.error) {
						setError(true);
						return;
					}
					let releasesArray: { value: string; label: string }[] = [
						{ value: "all", label: "Все релизы" },
					];
					for (const release of releases.releases) {
						releasesArray.push({
							value: `${release.id}`,
							label: `${release.artists} - ${release.title}`,
						});
					}
					setReleases(releasesArray);
				}

				const streams = await getStreams(
					release.value !== "all" ? release.value : undefined
				);
				if (streams.error) {
					setError(true);
					return;
				}
				setAllStreams(streams.all_streams);
				setPayStreams(streams.pay_streams);

				const dateStreams = await getDateStreams(
					release.value !== "all" ? release.value : undefined
				);

				if (dateStreams.error) {
					setError(true);
					return;
				}
				let pays: number[] = [];
				let alls: number[] = [];
				let dates: string[] = [];
				let lastDate: string = "";
				let streamsPayLast: number = 0;
				let streamsAllLast: number = 0;
				if (dateStreams.streams.length !== 0) {
					lastDate = dateStreams.streams[0].date;
				}
				for (const stream of dateStreams.streams) {
					if (stream.date === lastDate) {
						streamsPayLast = streamsPayLast + stream.pay_streams;
						streamsAllLast = streamsAllLast + stream.all_streams;
					} else {
						dates.push(lastDate);
						pays.push(streamsPayLast);
						alls.push(streamsAllLast);
						streamsPayLast = 0;
						streamsAllLast = 0;
						lastDate = stream.date;
						streamsPayLast = streamsPayLast + stream.pay_streams;
						streamsAllLast = streamsAllLast + stream.all_streams;
					}
				}
				setDateStreams({
					labels: dates,
					datasets: [
						{
							label: "Все прослушивания",
							data: alls,
							borderColor: "rgb(255, 99, 132)",
							backgroundColor: "rgba(255, 99, 132, 0.5)",
						},
						{
							label: "Платные прослушивания",
							data: pays,
							borderColor: "rgb(53, 162, 235)",
							backgroundColor: "rgba(53, 162, 235, 0.5)",
						},
					],
				});

				const top = await getTopReleases(
					release.value !== "all" ? release.value : undefined
				);
				if (top.error) {
					setError(true);
					return;
				}
				setTopReleases(top.analytics);

				setError(false);
			} catch (e) {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		getData();
		// eslint-disable-next-line
	}, [release]);

	const onRefresh = async () => {
		try {
			setIsRefreshing(true);
			const releases = await getReleases();
			if (releases.error) {
				setError(true);
				return;
			}
			let releasesArray: { value: string; label: string }[] = [
				{ value: "all", label: "Все релизы" },
			];
			for (const release of releases.releases) {
				releasesArray.push({
					value: `${release.id}`,
					label: `${release.artists} - ${release.title}`,
				});
			}
			setReleases(releasesArray);

			const streams = await getStreams(
				release.value !== "all" ? release.value : undefined
			);
			if (streams.error) {
				setError(true);
				return;
			}
			setAllStreams(streams.all_streams);
			setPayStreams(streams.pay_streams);

			const dateStreams = await getDateStreams(
				release.value !== "all" ? release.value : undefined
			);

			if (dateStreams.error) {
				setError(true);
				return;
			}
			let pays: number[] = [];
			let alls: number[] = [];
			let dates: string[] = [];
			let lastDate: string = "";
			let streamsPayLast: number = 0;
			let streamsAllLast: number = 0;
			if (dateStreams.streams.length !== 0) {
				lastDate = dateStreams.streams[0].date;
			}
			for (const stream of dateStreams.streams) {
				if (stream.date === lastDate) {
					streamsPayLast = streamsPayLast + stream.pay_streams;
					streamsAllLast = streamsAllLast + stream.all_streams;
				} else {
					dates.push(lastDate);
					pays.push(streamsPayLast);
					alls.push(streamsAllLast);
					streamsPayLast = 0;
					streamsAllLast = 0;
					lastDate = stream.date;
					streamsPayLast = streamsPayLast + stream.pay_streams;
					streamsAllLast = streamsAllLast + stream.all_streams;
				}
			}
			setDateStreams({
				labels: dates,
				datasets: [
					{
						label: "Все прослушивания",
						data: alls,
						borderColor: "rgb(255, 99, 132)",
						backgroundColor: "rgba(255, 99, 132, 0.5)",
					},
					{
						label: "Платные прослушивания",
						data: pays,
						borderColor: "rgb(53, 162, 235)",
						backgroundColor: "rgba(53, 162, 235, 0.5)",
					},
				],
			});

			const top = await getTopReleases(
				release.value !== "all" ? release.value : undefined
			);
			if (top.error) {
				setError(true);
				return;
			}
			setTopReleases(top.analytics);

			setError(false);
		} catch (e) {
			setError(true);
		} finally {
			setIsRefreshing(false);
		}
	};

	return (
		<Root activeView={activeView}>
			<View activePanel="analyticsPage" id="analyticsPage">
				<Panel id="analyticsPage">
					<PanelHeader>Аналитика</PanelHeader>
					{isLoading && <ScreenSpinner state="loading" />}
					<PullToRefresh isFetching={isRefreshing} onRefresh={onRefresh}>
						<FormItem top="Фильтры">
							<SelectMimicry
								placeholder="Выберите релиз"
								onClick={() => setActiveView("selectRelease")}
							>
								{release.label}
							</SelectMimicry>
						</FormItem>
						{!isLoading && (
							<>
								{(!error && (
									<>
										<Group>
											<SimpleCell
												indicator={
													<Counter mode="primary">{allStreams}</Counter>
												}
											>
												Все прослушивания
											</SimpleCell>
											<SimpleCell
												indicator={
													<Counter mode="primary">{payStreams}</Counter>
												}
											>
												Платные прослушивания
											</SimpleCell>
											{dateStreams !== null && (
												<>
													{(dateStreams.labels.length !== 0 && (
														<Line options={options} data={dateStreams} />
													)) || (
														<NoData caption="Нет данных о прослушиваниях" />
													)}
												</>
											)}
										</Group>
										<Group
											header={<Header mode="secondary">Топ релизов</Header>}
										>
											{(topReleases?.length !== 0 && (
												<CardGrid size="l">
													{topReleases?.map((release, key) => (
														<ContentCard
															key={key}
															header={`${release.artists} – ${release.title}`}
															caption={`${release.all_streams} прослушиваний`}
														/>
													))}
												</CardGrid>
											)) || <NoData caption="Нет данных" />}
										</Group>
									</>
								)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
							</>
						)}
					</PullToRefresh>
				</Panel>
			</View>
			<View activePanel="selectRelease" id="selectRelease">
				<Panel id="selectRelease">
					<PanelHeader
						before={
							<PanelHeaderBack
								onClick={() => {
									setActiveView("analyticsPage");
									setSearched(null);
									setSearch("");
								}}
							/>
						}
					>
						Выбор релиза
					</PanelHeader>
					<Group>
						<Search
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								const search = e.target.value.toLowerCase();
								if (search.trim() === "") {
									setSearched(null);
									return;
								}
								setSearched(
									releases?.filter(
										({ label }) => label.toLowerCase().indexOf(search) > -1
									) as { value: string; label: string }[]
								);
							}}
						/>
						<List>
							{(!searched && (
								<>
									{releases?.map((item) => (
										<Cell
											onClick={() => {
												setRelease(item);
												setActiveView("analyticsPage");
												setSearched(null);
												setSearch("");
											}}
											after={
												release.value === item.value ? (
													<Icon24Done fill="var(--vkui--color_icon_accent)" />
												) : null
											}
										>
											{item.label}
										</Cell>
									))}
								</>
							)) || (
									<>
										{searched?.length !== 0 && (
											<>
												{searched?.map((item) => (
													<Cell
														onClick={() => {
															setSearched(null);
															setSearch("");
															setRelease(item);
															setActiveView("analyticsPage");
														}}
														after={
															release.value === item.value ? (
																<Icon24Done fill="var(--vkui--color_icon_accent)" />
															) : null
														}
													>
														{item.label}
													</Cell>
												))}
											</>
										)}
									</>
								) || <NoData caption="Релизов не найдено" />}
						</List>
					</Group>
				</Panel>
			</View>
		</Root>
	);
}

export default Analytics;
