import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDate.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import DatepickerDropdown from '../../DatepickerDropdown';
import moment from 'moment';
import classnames from 'classnames';
import { connect } from 'react-redux';
import localize from './ProjectDate.json';

class ProjectDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      disabled: false,
      value: props.value
    };
  }

  componentWillReceiveProps = newProps => {
    if (this.props.value !== newProps.value) {
      this.setState({ value: newProps.value });
    }
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  toggleEditing = () => {
    if (this.state.isEditing) {
      this.saveDate();
      this.stopEditing();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ isEditing: true }, () => {
      ReactTooltip.hide();
    });
  };

  stopEditing = () => {
    this.setState({ isEditing: false }, () => {
      ReactTooltip.hide();
    });
  };

  saveDate = () => {
    const { onEditSubmit } = this.props;
    onEditSubmit(this.state.value);
  };

  handleDayToChange = (date, modifiers) => {
    if (modifiers.disabled) {
      return this.setState({
        disabled: true
      });
    }

    this.setState(
      {
        disabled: false,
        value: date ? moment(date).format() : null
      },
      this.toggleEditing
    );
  };

  render() {
    const { header, disabledDataRanges, lang } = this.props;
    const { disabled, value } = this.state;
    const formattedDay = moment(value).format('DD.MM.YYYY');
    return (
      <div className={css.projectDate}>
        <div>{header}</div>

        <div className={css.editor}>
          {this.state.isEditing ? (
            <DatepickerDropdown
              className={classnames({
                [css.disabled]: disabled
              })}
              name="date"
              autoFocus
              value={value ? formattedDay : ''}
              onDayChange={this.handleDayToChange}
              selecteDAte
              placeholder={localize[lang].SELECT_DATA}
              disabledDataRanges={disabledDataRanges}
            />
          ) : (
            <div className={css.date}>
              {value ? formattedDay : <span style={{ color: 'silver' }}>{localize[lang].NOT_SPECIFIED}</span>}
            </div>
          )}
        </div>

        {this.props.isProjectAdmin ? (
          <div
            className={classnames({
              [css.save]: this.state.isEditing,
              [css.edit]: !this.state.isEditing
            })}
          >
            {this.state.isEditing ? (
              <IconCheck onClick={this.toggleEditing} data-tip={localize[lang].SAVE} />
            ) : (
              <IconEdit onClick={this.toggleEditing} data-tip={localize[lang].EDIT} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

ProjectDate.propTypes = {
  disabledDataRanges: PropTypes.array.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.number,
  isProjectAdmin: PropTypes.bool,
  lang: PropTypes.string,
  onEditSubmit: PropTypes.func.isRequired,
  value: PropTypes.string
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ProjectDate);
