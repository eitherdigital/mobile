import {
	FormItem,
	FormLayout,
	Group,
	PanelHeader,
	PanelHeaderBack,
	Radio,
} from "@vkontakte/vkui";
import React from "react";
import { getSettings, setApiType } from "../../hooks/Settings";

function Admin({ setActiveView }: { setActiveView: any }) {
	const onClose = () => setActiveView("settings");
	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				Настройки администратора
			</PanelHeader>

			<Group>
				<FormLayout>
					<FormItem top="Откуда брать данные">
						<Radio
							name="apiType"
							value="user"
							description="Данные будут отображаться из API для пользователей"
							onClick={() => {
								setApiType("user");
							}}
							defaultChecked={getSettings().apiType === "user" ? true : false}
						>
							Пользователь
						</Radio>
						<Radio
							name="apiType"
							value="admin"
							description="Данные будут отображаться из API для администраторов"
							onClick={() => {
								setApiType("admin");
							}}
							defaultChecked={getSettings().apiType === "admin" ? true : false}
						>
							Администратор
						</Radio>
					</FormItem>
				</FormLayout>
			</Group>
		</>
	);
}

export default Admin;
