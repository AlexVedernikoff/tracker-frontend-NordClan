import React from 'react';
import PropTypes from 'prop-types';
import localize from './ProjectTimesheets.json';
import TimesheetsTable from '../../../components/TimesheetsTable/';

type ProjectTimesheetsProps = {
	changeProjectWeek: (...args: any[]) => any,
	dateBegin: string,
	dateEnd: string,
	getProjectTimesheets?: (...args: any[]) => any,
	isSingleProjectPage: boolean,
	lang: 'en' | 'ru',
	list: any[],
	params: any,
	startingDay: any,
	users?: any[],
	submitProjectTimesheets: (...args: any[]) => any,
	approveProjectTimesheets: (...args: any[]) => any,
	rejectProjectTimesheets: (...args: any[]) => any,
	clearTimeSheetsState: (...args: any[]) => any,
	getTimesheets: (...args: any[]) => any,
	getAverageNumberOfEmployees: (...args: any[]) => any,
	submitUserTimesheets: (...args: any[]) => any,
	submitTimesheets: (...args: any[]) => any,
	approveTimesheets: (...args: any[]) => any,
	rejectTimesheets: (...args: any[]) => any,
	updateTimesheet: (...args: any[]) => any,
	deleteTimesheets: (...args: any[]) => any,
	deleteTempTimesheets: (...args: any[]) => any,
	editTempTimesheet: (...args: any[]) => any,
	createTimesheet: (...args: any[]) => any,
	updateSheetsArray: (...args: any[]) => any,
	changeWeek: (...args: any[]) => any,
	changeTask: (...args: any[]) => any,
	changeActivityType: (...args: any[]) => any,
	changeProject: (...args: any[]) => any,
	clearModalState: (...args: any[]) => any,
	addActivity: (...args: any[]) => any,
	filterTasks: (...args: any[]) => any,
	filterProjects: (...args: any[]) => any,
	getTasksForSelect: (...args: any[]) => any,
	getProjectsForSelect: (...args: any[]) => any,
	getLastSubmittedTimesheets: (...args: any[]) => any,
}

export class ProjectTimesheets extends React.Component<ProjectTimesheetsProps, any> {
	static propTypes = {
		changeProjectWeek: PropTypes.func,
		dateBegin: PropTypes.string,
		dateEnd: PropTypes.string,
		getProjectTimesheets: PropTypes.func,
		isSingleProjectPage: PropTypes.bool,
		lang: PropTypes.string,
		list: PropTypes.array,
		params: PropTypes.object,
		startingDay: PropTypes.object,
		users: PropTypes.arrayOf(PropTypes.object)
	};

	storageListener = (e) => {
		const { getProjectTimesheets, params, dateBegin, dateEnd } = this.props;
		if (e.key == 'projectTimesheet') {
			if (getProjectTimesheets) getProjectTimesheets(params.projectId, { dateBegin, dateEnd });
		}
	}

	componentDidMount() {
		const { getProjectTimesheets, params, dateBegin, dateEnd } = this.props;
		if (getProjectTimesheets) getProjectTimesheets(params.projectId, { dateBegin, dateEnd });

		window.addEventListener('storage', (e) => this.storageListener(e))
	}

	componentWillUnmount() {
		window.removeEventListener('storage', (e) => this.storageListener(e))
	}

	render() {
		const { lang, submitProjectTimesheets, approveProjectTimesheets, rejectProjectTimesheets } = this.props;

		return (
			<div>
				<section>
					<h3>{localize[lang].TIMESHEETS_REPORT}</h3>
					<hr />
					<TimesheetsTable
						{...this.props}
						approveTimesheets={approveProjectTimesheets}
						rejectTimesheets={rejectProjectTimesheets}
						submitTimesheets={submitProjectTimesheets}
					/>
				</section>
			</div>
		);
	}
}
