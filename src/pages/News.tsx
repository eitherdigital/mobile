import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	CardGrid,
	ContentCard,
	Group,
	PullToRefresh,
} from "@vkontakte/vkui";
import { getNews } from "../hooks/Api";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";
import NoData from "../components/NoData";

function News() {
	moment.locale("ru");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [news, setNews] = React.useState<any>(null);
	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const res = await getNews();
				setNews(res.news);
			} finally {
				setIsLoading(false);
			}
		};
		getData();
	}, []);
	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const onRefresh = React.useCallback(async () => {
		setIsRefreshing(true);

		try {
			const news = await getNews();
			setNews(news.news);
		} finally {
			setIsRefreshing(false);
		}
	}, []);
	return (
		<>
			{isLoading && <ScreenSpinner state="loading" />}
			<PanelHeader>Новости</PanelHeader>
			<PullToRefresh onRefresh={onRefresh} isFetching={isRefreshing}>
				<Group>
					{news !== null && (
						<>
							{news.length === 0 && <NoData caption="Новостей не найдено" />}
							<CardGrid size="l">
								{news.map((item: any) => (
									<ContentCard
										header={item.title}
										text={parse(item.body)}
										subtitle={moment(item.created_at).format("LL")}
									/>
								))}
							</CardGrid>
						</>
					)}
				</Group>
			</PullToRefresh>
		</>
	);
}

export default News;
