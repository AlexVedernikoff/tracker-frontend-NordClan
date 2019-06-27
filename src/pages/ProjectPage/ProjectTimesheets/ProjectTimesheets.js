import React from 'react';
import PropTypes from 'prop-types';
import localize from './ProjectTimesheets.json';
import TimesheetsTable from '../../../components/TimesheetsTable/TimesheetsTable';

export class ProjectTimesheets extends React.Component {
  static propTypes = {
    changeProjectWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    getProjectTimesheets: PropTypes.func,
    lang: PropTypes.string,
    list: PropTypes.array,
    params: PropTypes.object,
    startingDay: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.object)
  };

  componentDidMount() {
    const { getProjectTimesheets, params, dateBegin, dateEnd } = this.props;
    getProjectTimesheets(params.projectId, { dateBegin, dateEnd });
  }

  render() {
    const { lang } = this.props;
    return (
      <div>
        <section>
          <h3>{localize[lang].TIMESHEETS_REPORT}</h3>
          <hr />
          <TimesheetsTable {...this.props} />
        </section>
      </div>
    );
  }
}
