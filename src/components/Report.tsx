import React from "react";
import { IconButton, SimpleCell, Spinner } from "@vkontakte/vkui";
import { Icon28ArrowDownOutline } from "@vkontakte/icons";
import fileDownload from "js-file-download";
import axios from "axios";

function Report({ report }: any) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const download = () => {
		setIsLoading(true);
		axios
			.get(
				`https://api.codetabs.com/v1/proxy?quest=https://api.either.digital${report.file}`,
				{
					responseType: "blob",
				}
			)
			.then((res: any) => {
				const name = `${report.quarter} квартал ${report.year} года.csv`;

				fileDownload(res.data, name);
				setIsLoading(false);
			});
	};
	return (
		<SimpleCell
			before={
				<IconButton
					onClick={download}
					disabled={isLoading}
					style={{ color: "var(--vkui--color_icon_accent)" }}
				>
					{(isLoading && <Spinner />) || <Icon28ArrowDownOutline />}
				</IconButton>
			}
			indicator={`${report.sum} ₽`}
		>
			{report.quarter} квартал {report.year} года
		</SimpleCell>
	);
}

export default Report;