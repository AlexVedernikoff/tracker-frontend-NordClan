import React, { useEffect, useState } from 'react';
import css from './ActivitiesTable.scss';
import { any, arrayOf, number, shape, string, func, array } from 'prop-types';
import localize from './ActivitiesTable.json';
import ActivitiesTableHeader from '~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTableHeader';
import ActivitiesTableRow from '~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTableRow';
import { connect } from 'react-redux';

const ActivitiesTable = ({ tasks, lang, changeTask, statuses }) => {
  const [selectedTask, setSelectedTask] = useState<any[]>([]);

  const addSelectedTask = (task) => {
    const newSelectedTask = [...selectedTask, task];
    setSelectedTask(newSelectedTask);
  };

  const removeSelectedTask = (task) => {
    const newSelectedTask = !selectedTask.length ? [] : selectedTask.filter(selTask => selTask !== task);
    setSelectedTask(newSelectedTask);
  };

  const editTasksStatus = (select, task) => {
    if (select) {
      addSelectedTask(task);
    } else {
      removeSelectedTask(task);
    }
  };

  useEffect(() => {
    changeTask(selectedTask);
  }, [selectedTask]);

  return (
    <div>
      <table className={css.activitiesTable}>
        <ActivitiesTableHeader />
        <tbody className={css.tbody}>
          {tasks?.length
            ? tasks.map((task, index) => (
              <ActivitiesTableRow lang={lang} isSelect={!!(selectedTask.length && selectedTask.includes(task))} selectTask={editTasksStatus} key={task.value} index={index} task={task} statuses={statuses} />
            ))
            : <div className={css.noResult}>{localize[lang].NO_RESULT}</div>
          }
        </tbody>
      </table>
    </div>
  );
};

ActivitiesTable.propTypes = {
  tasks: arrayOf(shape({
    body: any.isRequired,
    label: string.isRequired,
    value: number.isRequired
  })),
  lang: string.isRequired,
  changeTask: func.isRequired,
  statuses: array.isRequired
};

const mapStateToProps = null;

export default connect(mapStateToProps)(ActivitiesTable);
