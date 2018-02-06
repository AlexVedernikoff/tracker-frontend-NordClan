import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from '../PlanningEdit.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import DatepickerDropdown from '../../DatepickerDropdown';
import moment from 'moment';
import classnames from 'classnames';

class ProjectDate extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.value !== newProps.value) {
      this.setState({value: newProps.value});
    }
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

  handleDayToChange = date => {
    this.setState({
      value: moment(date).format()
    });
  };

  render () {
    const { header, disabledDataRanges } = this.props;
    const { value } = this.state;
    const formattedDay = moment(value).format('DD.MM.YYYY');
    return (
      <div className={classnames(css.PlanningEdit, css.projectDate)}>
        <h2>{header}</h2>

        <div className={css.editor}>
          {
            this.state.isEditing
              ? <DatepickerDropdown
                name="date"
                value={value ? formattedDay : ''}
                onDayChange={this.handleDayToChange}
                placeholder="Введите дату"
                disabledDataRanges={disabledDataRanges}
              />
              : <div>{value ? formattedDay : 'Дата не указана'}</div>
          }
        </div>

        {
          this.props.isProjectAdmin
            ? <div className={css.editBorder}>
              {
                this.state.isEditing
                  ? <IconCheck
                    className={css.save}
                    onClick={this.toggleEditing}
                    data-tip="Сохранить"
                  />
                  : <IconEdit
                    className={css.edit}
                    onClick={this.toggleEditing}
                    data-tip="Редактировать"
                  />
              }
            </div>
            : null
        }
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
