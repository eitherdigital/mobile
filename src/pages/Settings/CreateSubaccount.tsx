import { Icon16Done } from "@vkontakte/icons";
import {
	Avatar,
	Button,
	FormItem,
	FormLayout,
	Group,
	Header,
	Input,
	PanelHeader,
	PanelHeaderBack,
	Snackbar,
	Textarea,
} from "@vkontakte/vkui";
import React from "react";
import { createSubaccount } from "../../hooks/Api";
import { getUser } from "../../hooks/Auth";

type ErrorType = {
	name: string | null;
	value: string | null;
};

function CreateSubaccount({
	setActiveView,
	setPopout,
}: {
	setActiveView: any;
	setPopout: any;
}) {
	const onClose = () => setActiveView("subaccounts");

	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [login, setLogin] = React.useState<string>("");
	const [copyrights, setCopyrights] = React.useState<string>("");
	const [error, setError] = React.useState<ErrorType>({
		name: null,
		value: null,
	});

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

	React.useEffect(() => {
		if (!user?.isLabel) {
			setCopyrights("EITHER.DIGITAL");
		}
	}, [user]);

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
			if (
				// eslint-disable-next-line
				!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
					email
				)
			) {
				setError({ name: "email", value: "Введите корректный Email" });
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
			const res = await createSubaccount(name, login, email, copyrights);
			if (res.error) {
				setError({ name: "login", value: res.error });
				return;
			}

			setName("");
			setEmail("");
			setLogin("");
			setCopyrights("");
			setError({ name: null, value: null });
			setPopout(
				<Snackbar
					onClose={() => setPopout(null)}
					before={
						<Avatar
							size={24}
							style={{ background: "var(--vkui--color_background_accent)" }}
						>
							<Icon16Done fill="#fff" width={14} height={14} />
						</Avatar>
					}
				>
					Субкабинет создан, данные отправлены на почту.
				</Snackbar>
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				Создать пользователя
			</PanelHeader>

			<Group header={<Header mode="secondary">Сведения о пользователе</Header>}>
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
							onChange={(e) => {
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
							onChange={(e) => {
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
							onChange={(e) => {
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
							onChange={(e) => {
								onChange("copyrights", e.target.value);
							}}
						></Textarea>
					</FormItem>
					<FormItem>
						<Button size="l" onClick={onSubmit} loading={isLoading} stretched>
							Создать
						</Button>
					</FormItem>
				</FormLayout>
			</Group>
		</>
	);
}

export default CreateSubaccount;
