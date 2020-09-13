import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss';
import Input from '../../../../components/Input';
import moment from 'moment';
const dateFormat = 'DD.MM.YYYY';
import localize from './StartEndDates.json';
import { connect } from 'react-redux';

class StartEndDates extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { lang } = this.props;

    return (
      <div className={css.startEndDatesWrp}>
        <div className={css.startEndDates}>
          {localize[lang].START_DATE}
          <Input readOnly value={this.props.startDate ? moment(this.props.startDate).format(dateFormat) : ''} />
        </div>
        <div className={css.startEndDates}>
          {localize[lang].END_DATE}
          <Input readOnly value={this.props.endDate ? moment(this.props.endDate).format(dateFormat) : ''} />
        </div>
      </div>
    );
  }
}
StartEndDates.propTypes = {
  endDate: PropTypes.string,
  lang: PropTypes.string,
  startDate: PropTypes.string
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(StartEndDates);
