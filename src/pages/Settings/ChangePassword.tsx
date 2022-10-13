import {
	Avatar,
	Banner,
	Button,
	FormItem,
	FormLayout,
	Group,
	Input,
	PanelHeader,
	PanelHeaderBack,
} from "@vkontakte/vkui";
import React from "react";
import { changePassword } from "../../hooks/Api";

function ChangePassword({ setActiveView }: { setActiveView: any }) {
	const [newPassword, setNewPassword] = React.useState<string>("");
	const [passwordChanged, setPasswordChanged] = React.useState<boolean>(false);
	const [passwordError, setPasswordError] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const onClose = () => {
		setActiveView("settings");
		setPasswordChanged(false);
		setNewPassword("");
		setPasswordError(false);
	};
	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				Сменить пароль
			</PanelHeader>

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
		</>
	);
}

export default ChangePassword;
