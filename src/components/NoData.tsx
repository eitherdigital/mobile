import React from "react";
import { Placeholder } from "@vkontakte/vkui";
import { Icon56ErrorOutline } from "@vkontakte/icons";

function NoData({ caption, icon }: { caption: string; icon?: any }) {
	return (
		<Placeholder icon={icon ? icon : <Icon56ErrorOutline />}>
			{caption}
		</Placeholder>
	);
}

export default NoData;
