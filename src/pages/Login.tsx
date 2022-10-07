import React from "react";
import {
	View,
	Panel,
	PanelHeader,
	Group,
	FormLayout,
	FormItem,
	Input,
	Button,
	ScreenSpinner,
} from "@vkontakte/vkui";
import { login } from "../hooks/Auth";

function Login() {
	const [email, setEmail] = React.useState<string>("");
	const [emailError, setEmailError] = React.useState<string | null>(null);
	const [password, setPassword] = React.useState<string>("");
	const [passwordError, setPasswordError] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onSubmit = async () => {
		setEmailError(null);
		setPasswordError(null);
		setIsLoading(true);
		try {
			let error: boolean = false;
			if (email.trim() === "") {
				setEmailError("Это поле обязательное");
				error = true;
			}
			if (password.trim() === "") {
				setPasswordError("Это поле обязательное");
				error = true;
			}
			if (error) return;
			const res = await login(email, password);
			if (!res.error) {
				window.location.href = "/";
				return;
			}

			if (res.error === "bad login or pass") {
				setEmailError("Неправильный логин или пароль");
				setPasswordError("Неправильный логин или пароль");
			} else {
				setEmailError(`Ошибка: ${res.error}`);
				setPasswordError(`Ошибка: ${res.error}`);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View activePanel="login">
			{isLoading && <ScreenSpinner state="loading" />}
			<Panel id="login">
				<PanelHeader>Авторизация</PanelHeader>
				<Group>
					<FormLayout>
						<FormItem
							top="Email"
							status={emailError ? "error" : "default"}
							bottom={emailError ? emailError : undefined}
						>
							<Input
								type="email"
								name="email"
								disabled={isLoading}
								value={email}
								onChange={(e) => setEmail(e.currentTarget.value)}
							/>
						</FormItem>
						<FormItem
							top="Пароль"
							status={passwordError ? "error" : "default"}
							bottom={passwordError ? passwordError : undefined}
						>
							<Input
								type="password"
								name="password"
								disabled={isLoading}
								value={password}
								onChange={(e) => setPassword(e.currentTarget.value)}
							/>
						</FormItem>
						<FormItem>
							<Button size="l" onClick={onSubmit} stretched loading={isLoading}>
								Войти
							</Button>
						</FormItem>
					</FormLayout>
				</Group>
			</Panel>
		</View>
	);
}

export default Login;
