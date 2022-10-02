import React from "react";
import {
	ModalPage,
	IOS,
	ModalPageHeader,
	PanelHeaderButton,
	PanelHeaderClose,
	ANDROID,
	ModalRoot,
	Avatar,
	Title,
	Gradient,
	AdaptivityProvider,
	SimpleCell,
	Switch,
	Group,
	Header,
	Separator,
	InfoRow,
	Textarea,
	FormItem,
	InitialsAvatar,
	calcInitialsAvatarColor,
	PanelHeaderBack,
	Alert,
	Input,
	FormLayout,
	Button,
	CellButton,
	Placeholder,
	Text,
	Banner,
} from "@vkontakte/vkui";
import {
	Icon24Dismiss,
	Icon28CopyOutline,
	Icon28DoneOutline,
	Icon28UserAddOutline,
	Icon56CheckCircleOutline,
	Icon28KeyOutline,
	Icon28InfoCircleOutline,
	Icon28HelpCircleOutline,
} from "@vkontakte/icons";
import { getUser, logout } from "../hooks/Auth";
import { Icon28ChevronRightOutline } from "@vkontakte/icons";
import NoData from "./NoData";
import {
	getSubaccounts,
	deleteSubaccount,
	createSubaccount as createSubaccountAPI,
	changePassword,
} from "../hooks/Api";
import { openLink } from "../hooks/Helpers";
import Icon from "../assets/images/icon.png";

function Modals({
	activeModal,
	onClose,
	platform,
	isMobile,
	release,
	setActiveModal,
	setPopout,
}: any) {
	const getInitials = (name: string) => {
		const [firstName, lastName] = name.split(" ");
		return firstName && lastName
			? `${firstName.charAt(0)}${lastName.charAt(0)}`
			: firstName.charAt(0);
	};
	const Settings = () => {
		const user = getUser();

		return (
			<ModalPage
				id={"settings"}
				onClose={onClose}
				settlingHeight={100}
				hideCloseButton={platform === IOS}
				header={
					<ModalPageHeader
						before={
							isMobile &&
							platform === ANDROID && <PanelHeaderClose onClick={onClose} />
						}
						after={
							platform === IOS && (
								<PanelHeaderButton onClick={onClose}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
					>
						Настройки
					</ModalPageHeader>
				}
			>
				<Gradient
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						padding: 32,
					}}
				>
					<InitialsAvatar
						gradientColor={calcInitialsAvatarColor(user?.id ? user.id : 1)}
						size={96}
					>
						{getInitials(user?.name ? user.name : "Загрузка")}
					</InitialsAvatar>
					<Title
						style={{ marginBottom: 8, marginTop: 20 }}
						level="2"
						weight="2"
					>
						{user?.name}
					</Title>
				</Gradient>

				<Separator />

				<Group header={<Header mode="secondary">Настройки</Header>}>
					<SimpleCell
						expandable
						onClick={() => {
							setActiveModal("change_password");
						}}
						before={<Icon28KeyOutline />}
					>
						Сменить пароль
					</SimpleCell>
					{!user?.isSubkabinet && (
						<SimpleCell
							expandable
							onClick={() => {
								setActiveModal("subaccounts");
							}}
							before={<Icon28UserAddOutline />}
						>
							Субкабинеты
						</SimpleCell>
					)}
					{window.localStorage.getItem("app-theme") && (
						<SimpleCell
							expandable
							onClick={() => {
								setActiveModal("about");
							}}
							before={<Icon28InfoCircleOutline />}
						>
							О приложении
						</SimpleCell>
					)}
					<SimpleCell
						expandable
						onClick={() => {
							openLink("mailto:mobile@either.digital");
						}}
						before={<Icon28HelpCircleOutline />}
					>
						Помощь
					</SimpleCell>
					<CellButton
						onClick={() => {
							logout();
							window.location.href = "/";
						}}
						mode="danger"
					>
						Выйти из аккаунта
					</CellButton>
				</Group>
			</ModalPage>
		);
	};

	const [copied, setCopied] = React.useState<boolean>(false);
	const user = getUser();
	const [subaccounts, setSubaccounts] = React.useState<any>(null);
	const [subaccount, setSubaccount] = React.useState<any>(null);
	const getSubaccountsAPI = async () => {
		const res = await getSubaccounts();
		setSubaccounts(res.users);
	};
	React.useEffect(() => {
		if (!user?.isSubkabinet) {
			getSubaccountsAPI();
		}
		// eslint-disable-next-line
	}, []);
	const [name, setName] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [login, setLogin] = React.useState<string>("");
	const [copyrights, setCopyrights] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [success, setSuccess] = React.useState<boolean>(false);
	type ErrorType = {
		name: string | null;
		value: string | null;
	};
	const [error, setError] = React.useState<ErrorType>({
		name: null,
		value: null,
	});
	React.useEffect(() => {
		if (!getUser()?.isLabel) {
			setCopyrights("EITHER.DIGITAL");
		}
	}, []);

	const [newPassword, setNewPassword] = React.useState<string>("");
	const [passwordChanged, setPasswordChanged] = React.useState<boolean>(false);
	const [passwordError, setPasswordError] = React.useState<boolean>(false);

	const change_password = () => {
		return (
			<ModalPage
				id={"change_password"}
				onClose={() => {
					setActiveModal("settings");
					setPasswordChanged(false);
					setNewPassword("");
					setPasswordError(false);
				}}
				header={
					<ModalPageHeader
						before={
							<PanelHeaderBack
								label="Назад"
								onClick={() => {
									setActiveModal("settings");
									setPasswordChanged(false);
									setNewPassword("");
									setPasswordError(false);
								}}
							/>
						}
					>
						Сменить пароль
					</ModalPageHeader>
				}
				settlingHeight={100}
			>
				<Group>
					{passwordChanged && (
						<Banner
							asideMode="dismiss"
							onDismiss={() => setPasswordChanged(false)}
							before={
								<Avatar
									size={28}
									style={{
										backgroundImage:
											"linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)",
									}}
								>
									<span style={{ color: "#fff" }}>!</span>
								</Avatar>
							}
							header="Пароль был успешно изменен"
						/>
					)}
					<FormLayout>
						<FormItem
							top="Новый пароль"
							status={passwordError ? "error" : "default"}
							bottom={passwordError ? "Введите пароль" : null}
						>
							<Input
								type="password"
								name="newPassword"
								value={newPassword}
								disabled={isLoading}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</FormItem>
						<FormItem>
							<Button
								size="l"
								onClick={async () => {
									try {
										setIsLoading(true);
										setPasswordChanged(false);
										if (newPassword.trim() === "") {
											setPasswordError(true);
											return;
										} else {
											setPasswordError(false);
										}
										await changePassword(newPassword);
										setPasswordChanged(true);
										setNewPassword("");
									} finally {
										setIsLoading(false);
									}
								}}
								loading={isLoading}
								stretched
							>
								Изменить пароль
							</Button>
						</FormItem>
					</FormLayout>
				</Group>
			</ModalPage>
		);
	};

	const about = () => (
		<ModalPage
			id={"about"}
			onClose={() => {
				setActiveModal("settings");
			}}
			header={
				<ModalPageHeader
					before={
						<PanelHeaderBack
							label="Назад"
							onClick={() => {
								setActiveModal("settings");
							}}
						/>
					}
				>
					О приложении
				</ModalPageHeader>
			}
			settlingHeight={100}
		>
			<Gradient
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					padding: 32,
				}}
			>
				<Avatar src={Icon} size={96} />
				<Text
					style={{
						marginBottom: 8,
						marginTop: 20,
						color: "var(--vkui--color_text_secondary)",
					}}
				>
					Версия {window.localStorage.getItem("app-version") || "unknown"}
				</Text>
			</Gradient>
			<Separator />
			<Group>
				<SimpleCell
					onClick={() => {
						openLink("mailto:mobile@either.digital");
					}}
				>
					Обратная связь
				</SimpleCell>
				<SimpleCell
					onClick={() => {
						openLink(
							"https://play.google.com/store/apps/details?id=digital.either.app"
						);
					}}
				>
					Оценить приложение
				</SimpleCell>
			</Group>
		</ModalPage>
	);

	const createSubaccount = () => {
		const onChange = (
			name: "name" | "email" | "login" | "copyrights",
			value: string
		) => {
			switch (name) {
				case "name":
					setName(value);
					break;
				case "email":
					setEmail(value);
					break;
				case "login":
					setLogin(value);
					break;
				case "copyrights":
					setCopyrights(value);
					break;
			}
		};

		const user = getUser();

		const onSubmit = async () => {
			setIsLoading(true);
			try {
				if (name.trim() === "") {
					setError({ name: "name", value: "Это поле обязательное" });
					return;
				}
				if (email.trim() === "") {
					setError({ name: "email", value: "Это поле обязательное" });
					return;
				}
				if (login.trim() === "") {
					setError({ name: "login", value: "Это поле обязательное" });
					return;
				}
				if (copyrights.trim() === "") {
					setError({ name: "copyrights", value: "Это поле обязательное" });
					return;
				}
				const res = await createSubaccountAPI(name, login, email, copyrights);
				if (res.error === "Пользователь уже существует.") {
					setError({ name: "login", value: res.error });
					return;
				}
				getSubaccountsAPI();
				setSuccess(true);

				setName("");
				setLogin("");
				setCopyrights("");
				setError({ name: null, value: null });
			} finally {
				setIsLoading(false);
			}
		};

		return (
			<ModalPage
				id={"createSubaccount"}
				onClose={() => {
					setActiveModal("subaccounts");
					setIsLoading(false);
					setName("");
					setEmail("");
					setLogin("");
					setCopyrights("");
					setError({ name: null, value: null });
					setTimeout(() => {
						setSuccess(false);
					}, 1000);
				}}
				header={
					<ModalPageHeader
						before={
							<PanelHeaderBack
								label="Назад"
								onClick={() => {
									setActiveModal("subaccounts");
									setIsLoading(false);
									setName("");
									setEmail("");
									setLogin("");
									setCopyrights("");
									setError({ name: null, value: null });
									setTimeout(() => {
										setSuccess(false);
									}, 1000);
								}}
							/>
						}
					>
						Создать пользователя
					</ModalPageHeader>
				}
				settlingHeight={100}
			>
				{(!success && (
					<>
						<Group
							header={<Header mode="secondary">Сведения о пользователе</Header>}
						>
							<FormLayout>
								<FormItem
									top="Имя"
									status={error.name === "name" ? "error" : "default"}
									bottom={error.name === "name" ? error.value : undefined}
								>
									<Input
										disabled={isLoading}
										type="text"
										name="name"
										value={name}
										onChange={(e: any) => {
											onChange("name", e.target.value);
										}}
									></Input>
								</FormItem>
								<FormItem
									top="Email"
									status={error.name === "email" ? "error" : "default"}
									bottom={error.name === "email" ? error.value : undefined}
								>
									<Input
										disabled={isLoading}
										type="text"
										name="email"
										value={email}
										onChange={(e: any) => {
											onChange("email", e.target.value);
										}}
									></Input>
								</FormItem>
								<FormItem
									top="Логин"
									status={error.name === "login" ? "error" : "default"}
									bottom={error.name === "login" ? error.value : undefined}
								>
									<Input
										disabled={isLoading}
										type="text"
										name="login"
										value={login}
										onChange={(e: any) => {
											onChange("login", e.target.value);
										}}
									></Input>
								</FormItem>
							</FormLayout>
						</Group>
						<Group header={<Header mode="secondary">Копирайты</Header>}>
							<FormLayout>
								<FormItem
									status={error.name === "copyrights" ? "error" : "default"}
									bottom={
										error.name === "copyrights"
											? error.value
											: "Укажите наименование лейблов (копирайт), к релизам указанных лейблов будет предоставлен доступ. Каждый лейбл вводите с новой строки."
									}
								>
									<Textarea
										name="copyrights"
										value={copyrights}
										disabled={user?.isLabel ? isLoading : true}
										onChange={(e: any) => {
											onChange("copyrights", e.target.value);
										}}
									></Textarea>
								</FormItem>
								<FormItem>
									<Button
										size="l"
										onClick={onSubmit}
										loading={isLoading}
										stretched
									>
										Создать
									</Button>
								</FormItem>
							</FormLayout>
						</Group>
					</>
				)) || (
					<Placeholder
						action={
							<Button
								size="m"
								onClick={() => {
									setActiveModal("subaccounts");
									setIsLoading(false);
									setName("");
									setEmail("");
									setLogin("");
									setCopyrights("");
									setTimeout(() => {
										setSuccess(false);
									}, 1000);
								}}
								mode="tertiary"
							>
								Назад
							</Button>
						}
						icon={<Icon56CheckCircleOutline />}
					>
						Аккаунт успешно создан, данные отправлены на почту {email}
					</Placeholder>
				)}
			</ModalPage>
		);
	};

	const subAccounts = () => {
		return (
			<ModalPage
				id={"subaccounts"}
				onClose={() => {
					setActiveModal("settings");
				}}
				header={
					<ModalPageHeader
						before={
							<PanelHeaderBack
								label="Назад"
								onClick={() => {
									setActiveModal("settings");
								}}
							/>
						}
					>
						Субкабинеты
					</ModalPageHeader>
				}
				settlingHeight={100}
			>
				{subaccounts !== null && (
					<Group>
						<CellButton
							onClick={() => {
								setActiveModal("createSubaccount");
							}}
							expandable
						>
							Создать пользователя
						</CellButton>
						{subaccounts.map((sub: any) => (
							<SimpleCell
								before={
									<InitialsAvatar
										gradientColor={calcInitialsAvatarColor(sub.id)}
										size={48}
									>
										{getInitials(sub.name)}
									</InitialsAvatar>
								}
								onClick={() => {
									setSubaccount(sub);
									setActiveModal("subaccount");
								}}
								expandable
								subtitle={sub.email}
							>
								{sub.name}
							</SimpleCell>
						))}
					</Group>
				)}
			</ModalPage>
		);
	};

	const subAccount = () => {
		return (
			<ModalPage
				id={"subaccount"}
				onClose={() => {
					setActiveModal("subaccounts");
				}}
				header={
					<ModalPageHeader
						before={
							<PanelHeaderBack
								label="Назад"
								onClick={() => {
									setActiveModal("subaccounts");
								}}
							/>
						}
					>
						{subaccount?.name}
					</ModalPageHeader>
				}
				settlingHeight={100}
			>
				<Gradient
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						padding: 32,
					}}
				>
					<InitialsAvatar
						gradientColor={calcInitialsAvatarColor(
							subaccount?.id ? subaccount.id : 1
						)}
						size={96}
					>
						{getInitials(subaccount?.name ? subaccount.name : "Загрузка")}
					</InitialsAvatar>
					<Title
						style={{ marginBottom: 8, marginTop: 20 }}
						level="2"
						weight="2"
					>
						{subaccount?.name}
					</Title>
				</Gradient>
				<Separator />
				<Group header={<Header mode="secondary">Информация</Header>}>
					<SimpleCell>
						<InfoRow header="Логин">{subaccount?.username}</InfoRow>
					</SimpleCell>
					<SimpleCell>
						<InfoRow header="Email">{subaccount?.email}</InfoRow>
					</SimpleCell>
					<CellButton
						onClick={() => {
							setPopout(
								<Alert
									actions={[
										{
											title: "Отмена",
											autoclose: true,
											mode: "cancel",
										},
										{
											title: "Удалить",
											autoclose: true,
											mode: "destructive",
											action: async () => {
												await deleteSubaccount(subaccount.id);
												await getSubaccountsAPI();
												setActiveModal("subaccounts");
											},
										},
									]}
									actionsLayout="horizontal"
									onClose={() => {
										setPopout(null);
									}}
									header="Удаление аккаунта"
									text="Вы уверены, что хотите удалить этот аккаунт?"
								/>
							);
						}}
						mode="danger"
					>
						Удалить аккаунт
					</CellButton>
				</Group>
			</ModalPage>
		);
	};

	const releaseInfo = () => (
		<ModalPage
			id={"release_info"}
			onClose={onClose}
			settlingHeight={100}
			hideCloseButton={platform === IOS}
			header={
				<ModalPageHeader
					before={
						isMobile &&
						platform === ANDROID && <PanelHeaderClose onClick={onClose} />
					}
					after={
						platform === IOS && (
							<PanelHeaderButton onClick={onClose}>
								<Icon24Dismiss />
							</PanelHeaderButton>
						)
					}
				>
					{release?.title}
				</ModalPageHeader>
			}
		>
			<SimpleCell>
				<InfoRow header="Обложка">
					<Avatar
						mode="image"
						src={`https://api.either.digital${release?.cover}`}
						size={128}
					/>
				</InfoRow>
			</SimpleCell>
			<Group
				header={
					<>
						<Separator />
						<Header mode="secondary">Информация о релизе</Header>
					</>
				}
			>
				<SimpleCell>
					<InfoRow header="Название релиза">{release?.title}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Версия">{release?.version || "Н/А"}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Исполнитель">{release?.artists}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Тип релиза">{release?.type}</InfoRow>
				</SimpleCell>
				<SimpleCell
					onClick={
						release?.upc
							? () => {
									if (copied) return;
									navigator.clipboard.writeText(release.upc);
									setCopied(true);
									setTimeout(() => {
										setCopied(false);
									}, 2000);
							  }
							: undefined
					}
					after={
						release?.upc ? (
							copied ? (
								<Icon28DoneOutline />
							) : (
								<Icon28CopyOutline />
							)
						) : undefined
					}
				>
					<InfoRow header="UPC">{release?.upc || "Н/А"}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Жанр">{release?.genre}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Дата релиза">{release?.date}</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Дата предзаказа">
						{release?.preorder_date || "Н/А"}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={<Header mode="secondary">Дополнительная информация</Header>}
			>
				<SimpleCell>
					<InfoRow header="Название лейбла">
						{release?.copyright || "Н/А"}
					</InfoRow>
				</SimpleCell>
				<AdaptivityProvider>
					<SimpleCell
						Component="label"
						after={
							<Switch
								disabled
								defaultChecked={release?.premiere_for_russia ? true : false}
							/>
						}
					>
						Ранний старт в России
					</SimpleCell>
				</AdaptivityProvider>
				<AdaptivityProvider>
					<SimpleCell
						Component="label"
						after={
							<Switch
								disabled
								defaultChecked={release?.realtime ? true : false}
							/>
						}
					>
						Доставка в реальном времени
					</SimpleCell>
				</AdaptivityProvider>
			</Group>
			<Group>
				<FormItem top="Сообщение для модератора">
					<Textarea readOnly defaultValue={release?.comment || ""} />
				</FormItem>
			</Group>
		</ModalPage>
	);
	const releasePlatforms = () => {
		let noPlatforms = false;
		if (
			!release?.apple &&
			!release?.deezer &&
			!release?.spotify &&
			!release?.vk_music &&
			!release?.yandex
		) {
			noPlatforms = true;
		}
		return (
			<ModalPage
				id={"release_platforms"}
				onClose={onClose}
				hideCloseButton={platform === IOS}
				header={
					<ModalPageHeader
						before={
							isMobile &&
							platform === ANDROID && <PanelHeaderClose onClick={onClose} />
						}
						after={
							platform === IOS && (
								<PanelHeaderButton onClick={onClose}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
					>
						Список платформ
					</ModalPageHeader>
				}
			>
				<Group>
					{noPlatforms && <NoData caption="Платформ сейчас не найдено" />}
					{release?.apple && (
						<SimpleCell
							onClick={() => {
								openLink(release.apple);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Apple Music
						</SimpleCell>
					)}
					{release?.deezer && (
						<SimpleCell
							onClick={() => {
								openLink(release.deezer);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Deezer
						</SimpleCell>
					)}
					{release?.spotify && (
						<SimpleCell
							onClick={() => {
								openLink(release.spotify);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Spotify
						</SimpleCell>
					)}
					{release?.vk_music && (
						<SimpleCell
							onClick={() => {
								openLink(release.vk_music);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							VK Музыка
						</SimpleCell>
					)}
					{release?.yandex && (
						<SimpleCell
							onClick={() => {
								openLink(release.yandex);
							}}
							after={<Icon28ChevronRightOutline />}
						>
							Яндекс Музыка
						</SimpleCell>
					)}
				</Group>
			</ModalPage>
		);
	};

	return (
		<ModalRoot activeModal={activeModal} onClose={onClose}>
			{Settings()}
			{releaseInfo()}
			{releasePlatforms()}
			{subAccounts()}
			{subAccount()}
			{createSubaccount()}
			{about()}
			{change_password()}
		</ModalRoot>
	);
}

export default Modals;
