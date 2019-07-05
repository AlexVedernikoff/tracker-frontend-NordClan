import React, { Component } from 'react';
import * as timesheetsActions from '../../actions/Timesheets';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CompanyReport from './CompanyReport';
import TimesheetsTable from '../../components/TimesheetsTable';
import Title from 'react-title-component';
import localize from './CompanyTimeSheets.json';

class CompanyTimeSheets extends Component {
  static propTypes = {
    approveTimesheets: PropTypes.func,
    changeProjectWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    getCompanyTimesheets: PropTypes.func,
    lang: PropTypes.string,
    list: PropTypes.array,
    params: PropTypes.object,
    rejectTimesheets: PropTypes.func,
    startingDay: PropTypes.object,
    submitUserTimesheets: PropTypes.func
  };

  componentDidMount() {
    this.getCompanyTimeSheets();
  }

  getCompanyTimeSheets = () => {
    const { getCompanyTimesheets, dateBegin, dateEnd } = this.props;
    getCompanyTimesheets({ dateBegin, dateEnd });
  };

  render() {
    const {
      list,
      changeProjectWeek,
      dateBegin,
      dateEnd,
      lang,
      startingDay,
      approveTimesheets,
      rejectTimesheets,
      submitUserTimesheets
    } = this.props;
    return (
      <div>
        <Title render={`[object Object] - ${localize[lang].COMPANY_TIMESHEETS_REPORT}`} />
        <section>
          <h1>{localize[lang].COMPANY_TIMESHEETS_REPORT}</h1>
          <hr />
          <CompanyReport />
          {list && (
            <TimesheetsTable
              approveTimesheets={approveTimesheets}
              rejectTimesheets={rejectTimesheets}
              submitTimesheets={submitUserTimesheets}
              changeProjectWeek={changeProjectWeek}
              dateBegin={dateBegin}
              dateEnd={dateEnd}
              getProjectTimesheets={() => {}}
              lang={lang}
              list={list}
              params={{}}
              startingDay={startingDay}
            />
          )}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startingDay: state.Timesheets.startingDay,
  list: state.Timesheets.list,
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyTimeSheets);
