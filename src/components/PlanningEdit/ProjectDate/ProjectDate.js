import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDate.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import DatepickerDropdown from '../../DatepickerDropdown';
import moment from 'moment';
import classnames from 'classnames';

class ProjectDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillReceiveProps = newProps => {
    if (this.props.value !== newProps.value) {
      this.setState({ value: newProps.value });
    }
  };

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

  handleDayToChange = date => {
    this.setState(
      {
        value: moment(date).format()
      },
      this.toggleEditing
    );
  };

  render() {
    const { header, disabledDataRanges } = this.props;
    const { value } = this.state;
    const formattedDay = moment(value).format('DD.MM.YYYY');
    return (
      <div className={css.projectDate}>
        <div>{header}</div>

        <div className={css.editor}>
          {this.state.isEditing ? (
            <DatepickerDropdown
              name="date"
              autoFocus
              value={value ? formattedDay : ''}
              onDayChange={this.handleDayToChange}
              selecteDAte
              placeholder="Введите дату"
              disabledDataRanges={disabledDataRanges}
            />
          ) : (
            <div className={css.date}>{value ? formattedDay : <span style={{ color: 'silver' }}>Не указано</span>}</div>
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
              <IconCheck onClick={this.toggleEditing} data-tip="Сохранить" />
            ) : (
              <IconEdit onClick={this.toggleEditing} data-tip="Редактировать" />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

ProjectDate.propTypes = {
  header: PropTypes.string.isRequired,
  id: PropTypes.number,
  isProjectAdmin: PropTypes.bool,
  onEditSubmit: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabledDataRanges: PropTypes.array.isRequired
};

export default ProjectDate;
