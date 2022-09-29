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
} from "@vkontakte/vkui";
import ReactApexChart from "react-apexcharts";

function Analytics() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
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
				if (dateStreams.length !== 0) {
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
					}
				}
				setDateStreams({
					series: [
						{
							name: "Все прослушивания",
							data: alls,
						},
						{
							name: "Платные прослушивания",
							data: pays,
						},
					],
					options: {
						chart: {
							height: 350,
							type: "line",
							zoom: {
								enabled: false,
							},
							toolbar: false,
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							curve: "straight",
						},

						grid: {
							row: {
								colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
								opacity: 0.5,
							},
						},
						xaxis: {
							categories: dates,
						},
					},
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

	return (
		<>
			<PanelHeader>Аналитика</PanelHeader>
			{isLoading && <ScreenSpinner state="loading" />}
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
					{!error && (
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
							{dateStreams && (
								<ReactApexChart
									options={dateStreams.options}
									series={dateStreams.series}
									type="line"
									height={350}
								/>
							)}
						</Group>
					)}
				</>
			)}
		</>
	);
}

export default Analytics;
