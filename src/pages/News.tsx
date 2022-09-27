import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	CardGrid,
	ContentCard,
	Group,
} from "@vkontakte/vkui";
import { getNews } from "../hooks/Api";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";

function News() {
	moment.locale("ru");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [news, setNews] = React.useState<any>([]);
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
	return (
		<>
			{isLoading && <ScreenSpinner state="loading" />}
			<PanelHeader>Новости</PanelHeader>
			<Group>
				<CardGrid size="l">
					{news.map((item: any) => (
						<ContentCard
							header={item.title}
							text={parse(item.body)}
							subtitle={moment(item.date).format("LL")}
						/>
					))}
				</CardGrid>
			</Group>
		</>
	);
}

export default News;
