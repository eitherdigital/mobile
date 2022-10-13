import {
	calcInitialsAvatarColor,
	CellButton,
	Group,
	InitialsAvatar,
	PanelHeader,
	PanelHeaderBack,
	PanelSpinner,
	SimpleCell,
} from "@vkontakte/vkui";
import React from "react";
import { getSubaccounts } from "../../hooks/Api";
import { UserData } from "../../hooks/Auth";
import { getInitials } from "../../hooks/Helpers";

function Subaccounts({
	setActiveView,
	setSubaccount,
}: {
	setActiveView: any;
	setSubaccount: any;
}) {
	const [subaccounts, setSubaccounts] = React.useState<UserData[] | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onClose = () => {
		setActiveView("settings");
	};

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const data = await getSubaccounts();
				setSubaccounts(data.users);
			} finally {
				setIsLoading(false);
			}
		};

		getData();
	}, []);
	return (
		<>
			<PanelHeader before={<PanelHeaderBack label="Назад" onClick={onClose} />}>
				Субкабинеты
			</PanelHeader>

			{(isLoading && <PanelSpinner />) || (
				<Group>
					<CellButton
						onClick={() => {
							setActiveView("createSubaccount");
						}}
						expandable
					>
						Создать пользователя
					</CellButton>
					{subaccounts?.map((sub, key) => (
						<SimpleCell
							key={key}
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
								setActiveView("subaccount");
							}}
							expandable
							subtitle={sub.email}
						>
							{sub.name}
						</SimpleCell>
					))}
				</Group>
			)}
		</>
	);
}

export default Subaccounts;
