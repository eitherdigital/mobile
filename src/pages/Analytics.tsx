import React, { ChangeEvent } from "react";
import { ReleaseType } from "../components/Release";
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
	CustomSelect,
	FormItem,
	Group,
	SimpleCell,
	Counter,
	Header,
	CardGrid,
	ContentCard,
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

	const [releases, setReleases] =
		React.useState<{ value: string; label: string }[] | null>(null);
	const [release, setRelease] = React.useState<string>("all");

	const [allStreams, setAllStreams] = React.useState<number>(0);
	const [payStreams, setPayStreams] = React.useState<number>(0);

	const [dateStreams, setDateStreams] = React.useState<any>(null);
	const [topReleases, setTopReleases] = React.useState<any>(null);

	React.useEffect(() => {
		const getData = async () => {
			try {
				setIsLoading(true);
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
					release !== "all" ? release : undefined
				);
				if (streams.error) {
					setError(true);
					return;
				}
				setAllStreams(streams.all_streams);
				setPayStreams(streams.pay_streams);

				const dateStreams = await getDateStreams(
					release !== "all" ? release : undefined
				);

				if (dateStreams.error) {
					setError(true);
					return;
				}
				let pays: any = [];
				let alls: any = [];
				let dates: any = [];
				let lastDate: any = null;
				let streamsPayLast: any = 0;
				let streamsAllLast: any = 0;
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
					release !== "all" ? release : undefined
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

			const streams = await getStreams(release !== "all" ? release : undefined);
			if (streams.error) {
				setError(true);
				return;
			}
			setAllStreams(streams.all_streams);
			setPayStreams(streams.pay_streams);

			const dateStreams = await getDateStreams(
				release !== "all" ? release : undefined
			);

			if (dateStreams.error) {
				setError(true);
				return;
			}
			let pays: any = [];
			let alls: any = [];
			let dates: any = [];
			let lastDate: any = null;
			let streamsPayLast: any = 0;
			let streamsAllLast: any = 0;
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

			const top = await getTopReleases(release !== "all" ? release : undefined);
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
		<>
			<PanelHeader>Аналитика</PanelHeader>
			{isLoading && <ScreenSpinner state="loading" />}
			<PullToRefresh isFetching={isRefreshing} onRefresh={onRefresh}>
				<FormItem top="Фильтры">
					<CustomSelect
						placeholder="Введите название релиза"
						searchable
						onChange={(e: ChangeEvent<HTMLSelectElement>) => {
							setRelease(e.target.value);
						}}
						options={
							releases ? releases : [{ value: "all", label: "Все релизы" }]
						}
					/>
				</FormItem>
				{!isLoading && (
					<>
						{(!error && (
							<>
								<Group>
									<SimpleCell
										indicator={<Counter mode="primary">{allStreams}</Counter>}
									>
										Все прослушивания
									</SimpleCell>
									<SimpleCell
										indicator={<Counter mode="primary">{payStreams}</Counter>}
									>
										Платные прослушивания
									</SimpleCell>
									{(dateStreams.labels.length !== 0 && (
										<Line options={options} data={dateStreams} />
									)) || <NoData caption="Нет данных о прослушиваниях" />}
								</Group>
								<Group header={<Header mode="secondary">Топ релизов</Header>}>
									{(topReleases.length !== 0 && (
										<CardGrid size="l">
											{topReleases.map((release: any) => (
												<ContentCard
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
		</>
	);
}

export default Analytics;
