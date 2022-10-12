import React from "react";
import { ScreenSpinner, PullToRefresh, Group, Header } from "@vkontakte/vkui";
import { getReports } from "../hooks/Api";
import NoData from "../components/NoData";
import Report from "../components/Report";
import { ReportType } from "../types";

function Finance() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);
	const [reports, setReports] = React.useState<ReportType[] | null>(null);

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const reports = await getReports();
				if (reports.error) {
					setError(true);
					return;
				}

				setReports(reports.financial);
				setError(false);
			} catch {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		getData();
	}, []);

	const onRefresh = React.useCallback(async () => {
		setIsRefreshing(true);
		try {
			const reports = await getReports();
			if (reports.error) {
				setError(true);
				return;
			}

			setReports(reports.financial);
			setError(false);
		} catch {
			setError(true);
		} finally {
			setIsRefreshing(false);
		}
	}, []);

	return (
		<PullToRefresh onRefresh={onRefresh} isFetching={isRefreshing}>
			{isLoading && <ScreenSpinner state="loading" />}
			{(!error && (
				<>
					{reports !== null && (
						<>
							{(reports.length === 0 && (
								<NoData caption="Отчетов не найдено" />
							)) || (
								<Group header={<Header mode="secondary">Отчеты</Header>}>
									{reports.map((report, key) => (
										<Report key={key} report={report} />
									))}
								</Group>
							)}
						</>
					)}
				</>
			)) || <NoData caption="Произошла ошибка, попробуйте позже." />}
		</PullToRefresh>
	);
}

export default Finance;
