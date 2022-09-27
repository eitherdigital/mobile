import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	CardGrid,
	ContentCard,
	Group,
	Card,
	Text,
} from "@vkontakte/vkui";
import { getNews } from "../hooks/Api";
import { Icon28ErrorOutline } from "@vkontakte/icons";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";

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
	return (
		<>
			{isLoading && <ScreenSpinner state="loading" />}
			<PanelHeader>Новости</PanelHeader>
			<Group>
				{news !== null && (
					<CardGrid size="l">
						{news.length === 0 && (
							<Card mode="shadow" style={{ margin: "20px" }}>
								<div className="either__noData-stack">
									<Icon28ErrorOutline />
									<Text className="either__noData-caption" weight="2">
										Новостей не найдено
									</Text>
								</div>
							</Card>
						)}
						{news.map((item: any) => (
							<ContentCard
								header={item.title}
								text={parse(item.body)}
								subtitle={moment(item.created_at).format("LL")}
							/>
						))}
					</CardGrid>
				)}
			</Group>
		</>
	);
}

export default News;