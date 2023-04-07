import React, {FC, useState, FormEvent, ChangeEvent, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment, {Moment} from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import css from './TaskWorkTime.scss';
import localize from './TaskWorkTime.json';
import TextareaAutosize from 'react-autosize-textarea';
import Input from '~/components/Input';
import DatepickerDropdown from '~/components/DatepickerDropdown/DatepickerDropdown';
import Button from '~/components/Button';
import { createTimesheet, updateTimesheet, getTaskTimesheets, removeTimesheets } from '~/actions/Timesheets';
import {IconPlus} from '~/components/Icons';
import ActivityNote from '~/pages/TaskPage/TaskWorkTime/ActivityNote';


interface ITaskWorkTimeProps {
  lang: string,
  task: any,
  selectedActivityType: number,
  createTimesheet: (data: any) => Promise<any>,
  updateTimesheet: (data: any) => Promise<any>,
  getTaskTimesheets: (id: number) => Promise<any>,
  deleteTimesheets: (ids: number[]) => Promise<any>,
  params: { projectId: string, taskId: string }
}

interface ITimesheet {
  comment: string,
  date: string,
  workTime: string,
}

const TaskWorkTime: FC<ITaskWorkTimeProps> = ({
    lang,
    task,
    getTaskTimesheets,
    deleteTimesheets,
    params,
    updateTimesheet,
    selectedActivityType,
    createTimesheet
}) => {

  const [timesheetsAll, setTimesheetsAll] = useState<any[]>([]);
  const [timesheet, setTimesheet] = useState<ITimesheet>({
    comment: '',
    date: moment().toISOString(),
    workTime: ''
  });
  const [isOpenForm, setIsOpenForm] = useState(false);

  const onChangeComment = (e: FormEvent<HTMLTextAreaElement>) => {
    e.persist();
    setTimesheet(prev => ({ ...prev, comment: (e.target as HTMLInputElement).value }));
  };

  const onChangeCount = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    let value = e.target.value;
    if (value.includes('.')) {
      value = value.slice(0, value.indexOf('.') + 3);
    }
    setTimesheet(prev => ({ ...prev, workTime: value }));
  };

  const onDateChange = (date: Moment) => {
    setTimesheet(prev => ({ ...prev, date: date.toISOString() }));
  };

  const formattedDate = () => timesheet.date ? moment(timesheet.date).format('DD.MM.YYYY') : '';

  const changeTimesheet = () => {
    timesheetsAll.forEach((item) => {
      if (moment(item?.onDate).format('YYYY-MM-DD') === moment(timesheet.date).format('YYYY-MM-DD')) {
        setTimesheet({
          comment: item?.comment,
          date: item?.onDate,
          workTime: item?.spentTime
        });
      }
    });
  };

  const updateTimesheetsVeiw = () => {
    getTaskTimesheets(+params.taskId).then(timesheets => {
      setTimesheetsAll(timesheets);
    });
  };

  useEffect(() => {
    updateTimesheetsVeiw();
  }, []);

  useEffect(() => {
    changeTimesheet();
  }, [timesheetsAll, timesheet.date]);

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (+timesheet.workTime > 24) {
      return;
    }

    createTimesheet({
      isDraft: false,
      taskId: task.id || null,
      typeId: selectedActivityType,
      spentTime: +timesheet.workTime,
      onDate: moment(timesheet.date).format('YYYY-MM-DD'),
      projectId: task.projectId || task?.project?.id,
      sprintId: task?.sprint?.id || null
    }).then(({ data }) => {
        updateTimesheet({
          sheetId: data?.id,
          comment: timesheet.comment
        }).then(() => {
          setTimesheet({
            comment: '',
            date: '',
            workTime: ''
          });
          updateTimesheetsVeiw();
        });
    });
  };

  const deleteActivity = (timesheet) => {
    deleteTimesheets([timesheet.id]).then(() => {
      updateTimesheetsVeiw();
    });
  };

  const editActivity = (timesheet) => {
    if (!isOpenForm) {
      setIsOpenForm(true);
    }
    setTimesheet({
      comment: timesheet?.comment,
      date: timesheet?.onDate,
      workTime: timesheet?.spentTime
    });
  };

  return (
    <div className={css.workTimeTab}>
      <a className={css.add} onClick={() => setIsOpenForm(!isOpenForm)}>
        <IconPlus style={{ fontSize: 16, transform: isOpenForm ? 'rotate(45deg)' : 'rotate(0deg)' }} />
        <div className={css.tooltip}>{isOpenForm ? localize[lang].CLOSE_FORM : localize[lang].ADD_ACTIVITY}</div>
      </a>
      <ReactCSSTransitionGroup
        transitionName="animatedElement"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
      {isOpenForm &&
        <form className={css.form}>
          <label className={css.field}>
            <span>Дата:</span>
            <DatepickerDropdown
              onDayChange={onDateChange}
              placeholder={localize[lang].WORK_DATE}
              value={formattedDate()}
            />
          </label>
          <label className={css.field}>
            <span>Время:</span>
            <Input
              type={'number'}
              placeholder={localize[lang].TIME_COUNT}
              onChange={onChangeCount}
              value={timesheet.workTime}
            />
          </label>
          <label className={css.field}>
            <span>Комментарий:</span>
            <TextareaAutosize
              disabled={false}
              className={css.fullwidth}
              onChange={onChangeComment}
              placeholder={localize[lang].ENTER_COMMENT}
              value={timesheet.comment}
              rows={4}
            />
          </label>
          <Button
            text={localize[lang].SUBMIT}
            type="green"
            htmlType="submit"
            disabled={!timesheet.date || !timesheet.workTime}
            onClick={onSubmit}
          />
        </form>}
      </ReactCSSTransitionGroup>

      {timesheetsAll.map((item) => (
        <ActivityNote key={item.id} timesheet={item} deleteActivity={deleteActivity} editActivity={editActivity} />
      ))}

    </div>
  );
};

TaskWorkTime.propTypes = {
  createTimesheet: PropTypes.func.isRequired,
  deleteTimesheets: PropTypes.func.isRequired,
  getTaskTimesheets: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }).isRequired,
  selectedActivityType: PropTypes.number.isRequired,
  task: PropTypes.object,
  updateTimesheet: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  task: state.Task.task,
  selectedActivityType: state.Timesheets.selectedActivityType || 0
});

const mapDispatchToProps = {
  updateTimesheet,
  createTimesheet,
  getTaskTimesheets,
  deleteTimesheets: removeTimesheets
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskWorkTime);
