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
	Root,
	View,
	Panel,
} from "@vkontakte/vkui";
import { Icon28SettingsOutline } from "@vkontakte/icons";
import { getLastReleases, getNews } from "../hooks/Api";
import moment from "moment";
import "moment/locale/ru";
import parse from "html-react-parser";
import NoData from "../components/NoData";
import Release, { ReleaseType } from "../components/Release";
import { DashboardType, NewsType } from "../types";
import Settings from "./Settings";
import Admin from "./Settings/Admin";
import ChangePassword from "./Settings/ChangePassword";
import Subaccounts from "./Settings/Subaccounts";
import { UserData } from "../hooks/Auth";
import Subaccount from "./Settings/Subaccount";
import CreateSubaccount from "./Settings/CreateSubaccount";
import About from "./Settings/About";

function Dashboard({
	setActiveModal,
	setActiveStory,
	platform,
	setPopout,
	setRelease,
}: DashboardType) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);
	const [news, setNews] = React.useState<NewsType[] | null>(null);
	const [releases, setReleases] = React.useState<ReleaseType[] | null>(null);
	const [subaccount, setSubaccount] = React.useState<UserData | null>(null);

	const [activeView, setActiveView] = React.useState<string>("dashboardPage");

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
		<Root activeView={activeView}>
			<View activePanel={"dashboardPage"} id="dashboardPage">
				<Panel id="dashboardPage">
					{isLoading && <ScreenSpinner state="loading" />}
					<PanelHeader
						after={
							<PanelHeaderButton
								aria-label="Настройки"
								onClick={() => {
									setActiveView("settings");
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
								<Group
									header={<Header mode="secondary">Последние релизы</Header>}
								>
									{releases !== null && (
										<>
											{(releases.length === 0 && (
												<NoData caption="Релизов не найдено" />
											)) || (
												<>
													{releases.map((release: ReleaseType, key) => (
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
							</>
						)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
					</PullToRefresh>
				</Panel>
			</View>
			<View activePanel={"settings"} id="settings">
				<Panel id="settings">
					<Settings setActiveView={setActiveView} />
				</Panel>
			</View>
			<View activePanel={"admin_settings"} id="admin_settings">
				<Panel id="admin_settings">
					<Admin setActiveView={setActiveView} />
				</Panel>
			</View>
			<View activePanel={"change_password"} id="change_password">
				<Panel id="change_password">
					<ChangePassword setActiveView={setActiveView} />
				</Panel>
			</View>
			<View activePanel={"subaccounts"} id="subaccounts">
				<Panel id="subaccounts">
					<Subaccounts
						setSubaccount={setSubaccount}
						setActiveView={setActiveView}
					/>
				</Panel>
			</View>
			<View activePanel={"subaccount"} id="subaccount">
				<Panel id="subaccount">
					<Subaccount
						subaccount={subaccount}
						setActiveView={setActiveView}
						setPopout={setPopout}
					/>
				</Panel>
			</View>
			<View activePanel={"createSubaccount"} id="createSubaccount">
				<Panel id="createSubaccount">
					<CreateSubaccount
						setActiveView={setActiveView}
						setPopout={setPopout}
					/>
				</Panel>
			</View>
			<View activePanel={"about"} id="about">
				<Panel id="about">
					<About setActiveView={setActiveView} />
				</Panel>
			</View>
		</Root>
	);
}

export default Dashboard;
