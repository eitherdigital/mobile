import { PlatformType } from "@vkontakte/vkui";
import { ReleaseType } from "./components/Release";

export type ViewWidthType = {
	viewWidth: number;
};

export type ModalsType = {
	activeModal: string | null;
	onClose: () => void;
	platform: PlatformType;
	isMobile: boolean;
	release: ReleaseType | null;
};

export type ReleaseComponentType = {
	release: ReleaseType;
	platform: PlatformType;
	setPopout: any;
	refreshReleases: () => void;
	setActiveModal: any;
	setRelease: any;
};

export type DateStreamType = {
	labels: string[];
	datasets: [
		{
			label: "Все прослушивания";
			data: number[];
			borderColor: "rgb(255, 99, 132)";
			backgroundColor: "rgba(255, 99, 132, 0.5)";
		},
		{
			label: "Платные прослушивания";
			data: number[];
			borderColor: "rgb(53, 162, 235)";
			backgroundColor: "rgba(53, 162, 235, 0.5)";
		}
	];
};

export type TopReleaseType = {
	id: number;
	user_id: number;
	release_id: number;
	title: string;
	artists: string;
	pay_streams: number;
	all_streams: number;
	upc: string;
	created_at: string;
	updated_at: string;
};

export type ReportType = {
	id: number;
	user_id: number;
	quarter: number;
	year: string;
	file: string;
	sum: string;
	created_at: string;
	updated_at: string;
};

export type CatalogType = {
	setActiveModal: any;
	platform: PlatformType;
	setPopout: any;
	setRelease: any;
};

export type DashboardType = {
	setActiveModal: any;
	setActiveStory: any;
	platform: PlatformType;
	setPopout: any;
	setRelease: any;
};

export type NewsType = {
	id: number;
	title: string;
	body: string;
	created_at: string;
	updated_at: string;
};
