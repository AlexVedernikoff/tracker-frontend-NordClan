import React, { useEffect, useState } from 'react';
import * as css from './ActivitiesTable.scss';
import { any, arrayOf, number, shape, string, func, array } from 'prop-types';
import localize from './ActivitiesTable.json'
import ActivitiesTableHeader from '~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTableHeader';
import ActivitiesTableRow from '~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTableRow';

const ActivitiesTable = ({ tasks, lang, changeTask, statuses }) => {
  const [selectedTask, setSelectedTask] = useState<any[]>([])

  const select = (select, task) => {
    const newSelectedTask = select ? [...selectedTask, task] : !selectedTask.length ? [] : selectedTask.filter(selTask => selTask !== task)
    setSelectedTask(newSelectedTask)
  }

  useEffect(() => {
    changeTask(selectedTask)
  }, [selectedTask])

  return (
    <div>
      <table className={css.activitiesTable}>
        <ActivitiesTableHeader />
        <tbody className={css.tbody}>
          {tasks?.length
            ? tasks.map((task, index) => (
              <ActivitiesTableRow lang={lang} isSelect={selectedTask.length && selectedTask.includes(task)} selectTask={select} key={task.value} index={index} task={task} statuses={statuses} />
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

export default ActivitiesTable;
