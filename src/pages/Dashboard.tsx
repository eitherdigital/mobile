import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	PanelHeaderButton,
	Group,
	Header,
	CardGrid,
	ContentCard,
	Link,
	PullToRefresh,
} from "@vkontakte/vkui";
import { Icon28SettingsOutline } from "@vkontakte/icons";
import { getLastReleases, getNews } from "../hooks/Api";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";
import NoData from "../components/NoData";
import Release, { ReleaseType } from "../components/Release";

function Dashboard({
	setActiveModal,
	setActiveStory,
	platform,
	setPopout,
	setRelease,
}: any) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);
	const [news, setNews] = React.useState<any>(null);
	const [releases, setReleases] = React.useState<any>(null);

	moment.locale("ru");

	const getData = async () => {
		setIsLoading(true);
		try {
			const news = await getNews();
			if (news.error) {
				setError(true);
				return;
			}
			setNews(news.news);
			const releases = await getLastReleases();
			setReleases(releases.releases);
			setError(false);
		} catch {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const onRefresh = React.useCallback(async () => {
		setIsRefreshing(true);
		try {
			const news = await getNews();
			if (news.error) {
				setError(true);
				return;
			}
			setNews(news.news);
			const releases = await getLastReleases();
			setReleases(releases.releases);
			setError(false);
		} catch {
			setError(true);
		} finally {
			setIsRefreshing(false);
		}
	}, []);

	React.useEffect(() => {
		getData();
	}, []);

	return (
		<>
			{isLoading && <ScreenSpinner state="loading" />}
			<PanelHeader
				after={
					<PanelHeaderButton
						aria-label="Настройки"
						onClick={() => {
							setActiveModal("settings");
						}}
					>
						<Icon28SettingsOutline />
					</PanelHeaderButton>
				}
			>
				Главная
			</PanelHeader>
			<PullToRefresh onRefresh={onRefresh} isFetching={isRefreshing}>
				{(!error && (
					<>
						<Group
							separator={"hide"}
							header={<Header mode="secondary">Новости</Header>}
						>
							{news !== null && (
								<>
									{(news.length === 0 && (
										<NoData caption="Новостей не найдено" />
									)) || (
										<CardGrid size="l">
											<ContentCard
												header={news[0].title}
												text={parse(news[0].body)}
												subtitle={moment(news[0].created_at).format("LL")}
											/>
											<Link
												style={{ marginTop: "8px" }}
												onClick={() => setActiveStory("news")}
											>
												Показать все
											</Link>
										</CardGrid>
									)}
								</>
							)}
						</Group>
						<Group header={<Header mode="secondary">Последние релизы</Header>}>
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
					</>
				)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
			</PullToRefresh>
		</>
	);
}

export default Dashboard;
