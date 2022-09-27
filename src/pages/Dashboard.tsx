import React from "react";
import {
	PanelHeader,
	ScreenSpinner,
	PanelHeaderButton,
	Group,
	Header,
	CardGrid,
	Card,
	Text,
	ContentCard,
	Link,
} from "@vkontakte/vkui";
import { Icon28SettingsOutline, Icon28ErrorOutline } from "@vkontakte/icons";
import { getNews } from "../hooks/Api";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";

function Dashboard({ setActiveModal, setActiveStory }: any) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [news, setNews] = React.useState<any>(null);
	const [releases, setReleases] = React.useState<any>(null);

	moment.locale("ru");

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
			<PanelHeader
				before={
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
			<Group header={<Header mode="secondary">Новости</Header>}>
				{news !== null && (
					<CardGrid size="l">
						{(news.length === 0 && (
							<Card mode="shadow" style={{ margin: "20px" }}>
								<div className="either__noData-stack">
									<Icon28ErrorOutline />
									<Text className="either__noData-caption" weight="2">
										Новостей не найдено
									</Text>
								</div>
							</Card>
						)) || (
							<>
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
							</>
						)}
					</CardGrid>
				)}
			</Group>
		</>
	);
}

export default Dashboard;
