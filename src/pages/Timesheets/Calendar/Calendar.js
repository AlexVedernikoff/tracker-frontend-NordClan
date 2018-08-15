import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import DayPicker from 'react-day-picker';
import onClickOutside from 'react-onclickoutside';
import LocaleUtils from 'react-day-picker/moment';
import * as css from '../Timesheets.scss';

class Calendar extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onCancel: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true
    };
  }

  handleClickOutside = () => {
    this.props.onCancel();
  };

  render() {
    const { lang, ...other } = this.props;

    return (
      <div className={cn(css.dateDropdown, 'st-week-select')}>
        <DayPicker locale={lang} enableOutsideDays localeUtils={{ ...LocaleUtils }} {...other} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(onClickOutside(Calendar));
