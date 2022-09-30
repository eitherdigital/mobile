import React from "react";
import {
	withAdaptivity,
	usePlatform,
	VKCOM,
	ViewWidth,
	SplitLayout,
	PanelHeader,
	SplitCol,
	Panel,
	Group,
	Cell,
	Epic,
	Tabbar,
	TabbarItem,
	View,
	ScreenSpinner,
} from "@vkontakte/vkui";
import {
	Icon28HomeOutline,
	Icon28NewsfeedMusicNoteOutline,
	Icon28GraphOutline,
	Icon28DollarOutline,
	Icon28NewsfeedLinesOutline,
	Icon56BlockOutline,
} from "@vkontakte/icons";
import { getAuth, getUser, updateAuth } from "./hooks/Auth";
import Login from "./pages/Login";
import { isBrowser } from "react-device-detect";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import Modals from "./components/Modals";
import { ReleaseType } from "./components/Release";
import NoData from "./components/NoData";
import Catalog from "./pages/Catalog";
import Finance from "./pages/Finance";
import Analytics from "./pages/Analytics";

const Authed = withAdaptivity(
	({ viewWidth }: any) => {
		const platform = usePlatform();
		const isMobile = viewWidth <= ViewWidth.MOBILE;
		const [activeModal, setActiveModal] = React.useState<string | null>(null);
		const [activeStory, setActiveStory] = React.useState<string>("dashboard");
		const onStoryChange = (e: any) =>
			setActiveStory(e.currentTarget.dataset.story);
		const isDesktop = viewWidth >= ViewWidth.TABLET;
		const hasHeader = platform !== VKCOM;
		const [popout, setPopout] = React.useState<any>(null);
		const [release, setRelease] = React.useState<ReleaseType | null>(null);
		const user = getUser();

		return (
			<SplitLayout
				header={hasHeader && <PanelHeader separator={false} />}
				style={{ justifyContent: "center" }}
				popout={popout}
				modal={
					<Modals
						platform={platform}
						onClose={() => setActiveModal(null)}
						activeModal={activeModal}
						isMobile={isMobile}
						release={release}
						setActiveModal={setActiveModal}
					/>
				}
			>
				{isDesktop && (
					<SplitCol fixed width={280} maxWidth={280}>
						<Panel>
							{hasHeader && <PanelHeader />}
							<Group>
								<Cell
									disabled={activeStory === "dashboard"}
									style={
										activeStory === "dashboard"
											? {
													backgroundColor:
														"var(--vkui--color_background_secondary)",
													borderRadius: 8,
											  }
											: {}
									}
									data-story="dashboard"
									onClick={onStoryChange}
									before={<Icon28HomeOutline />}
								>
									Главная
								</Cell>
								<Cell
									disabled={activeStory === "catalog"}
									style={
										activeStory === "catalog"
											? {
													backgroundColor:
														"var(--vkui--color_background_secondary)",
													borderRadius: 8,
											  }
											: {}
									}
									data-story="catalog"
									onClick={onStoryChange}
									before={<Icon28NewsfeedMusicNoteOutline />}
								>
									Каталог
								</Cell>
								<Cell
									disabled={activeStory === "analytics"}
									style={
										activeStory === "analytics"
											? {
													backgroundColor:
														"var(--vkui--color_background_secondary)",
													borderRadius: 8,
											  }
											: {}
									}
									data-story="analytics"
									onClick={onStoryChange}
									before={<Icon28GraphOutline />}
								>
									Аналитика
								</Cell>
								<Cell
									disabled={activeStory === "finance"}
									style={
										activeStory === "finance"
											? {
													backgroundColor:
														"var(--vkui--color_background_secondary)",
													borderRadius: 8,
											  }
											: {}
									}
									data-story="finance"
									onClick={onStoryChange}
									before={<Icon28DollarOutline />}
								>
									Финансы
								</Cell>
								<Cell
									disabled={activeStory === "news"}
									style={
										activeStory === "news"
											? {
													backgroundColor:
														"var(--vkui--color_background_secondary)",
													borderRadius: 8,
											  }
											: {}
									}
									data-story="news"
									onClick={onStoryChange}
									before={<Icon28NewsfeedLinesOutline />}
								>
									Новости
								</Cell>
							</Group>
						</Panel>
					</SplitCol>
				)}

				<SplitCol
					animate={!isDesktop}
					spaced={isDesktop}
					width={isDesktop ? "560px" : "100%"}
					maxWidth={isDesktop ? "560px" : "100%"}
				>
					<Epic
						activeStory={activeStory}
						tabbar={
							!isDesktop && (
								<Tabbar>
									<TabbarItem
										onClick={onStoryChange}
										selected={activeStory === "dashboard"}
										data-story="dashboard"
										text="Главная"
									>
										<Icon28HomeOutline />
									</TabbarItem>
									<TabbarItem
										onClick={onStoryChange}
										selected={activeStory === "catalog"}
										data-story="catalog"
										text="Каталог"
									>
										<Icon28NewsfeedMusicNoteOutline />
									</TabbarItem>
									<TabbarItem
										onClick={onStoryChange}
										selected={activeStory === "analytics"}
										data-story="analytics"
										text="Аналитика"
									>
										<Icon28GraphOutline />
									</TabbarItem>
									<TabbarItem
										onClick={onStoryChange}
										selected={activeStory === "finance"}
										data-story="finance"
										text="Финансы"
									>
										<Icon28DollarOutline />
									</TabbarItem>
									<TabbarItem
										onClick={onStoryChange}
										selected={activeStory === "news"}
										data-story="news"
										text="Новости"
									>
										<Icon28NewsfeedLinesOutline />
									</TabbarItem>
								</Tabbar>
							)
						}
					>
						<View id="dashboard" activePanel="dashboard">
							<Panel id="dashboard">
								<Dashboard
									setActiveModal={setActiveModal}
									setActiveStory={setActiveStory}
									platform={platform}
									setRelease={setRelease}
									setPopout={setPopout}
								/>
							</Panel>
						</View>
						<View id="catalog" activePanel="catalog">
							<Panel id="catalog">
								<Catalog
									setActiveModal={setActiveModal}
									platform={platform}
									setRelease={setRelease}
									setPopout={setPopout}
								/>
							</Panel>
						</View>
						<View id="analytics" activePanel="analytics">
							<Panel id="analytics">
								<Analytics />
							</Panel>
						</View>
						<View id="finance" activePanel="finance">
							<Panel id="finance">
								<PanelHeader>Финансы</PanelHeader>
								{(user?.isSubkabinet && (
									<NoData
										caption="У вас нет прав для доступа к этому разделу"
										icon={<Icon56BlockOutline />}
									/>
								)) || <Finance />}
							</Panel>
						</View>
						<View id="news" activePanel="news">
							<Panel id="news">
								<News />
							</Panel>
						</View>
					</Epic>
				</SplitCol>
			</SplitLayout>
		);
	},
	{
		viewWidth: true,
	}
);

const App = () => {
	const [auth, setAuth] = React.useState<boolean | null>(null);

	React.useEffect(() => {
		if (isBrowser) {
			window.location.href = "https://lk.either.digital";
			return;
		}
		const checkAuth = async () => {
			const check = await getAuth();

			setAuth(check);

			if (check) {
				updateAuth();
			}
		};

		checkAuth();
	}, []);
	return auth === null ? (
		<ScreenSpinner state="loading" />
	) : auth ? (
		<Authed />
	) : (
		<Login />
	);
};

export default App;
