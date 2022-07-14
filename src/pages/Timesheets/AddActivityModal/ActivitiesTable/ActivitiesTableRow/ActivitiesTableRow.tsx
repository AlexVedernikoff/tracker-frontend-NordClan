import React from 'react';
import {any, func, number, shape, string, array} from 'prop-types';
import * as css from "~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTable.scss";
import classnames from 'classnames';

const ActivitiesTableRow = ({ task, index, lang, selectTask, active, statuses }) => {

  const type = () => {
    return statuses.find(t => t.value.includes(task.body.statusId)).label || '';
  }

  return (
    <tr
      className={classnames({
        [css.tr]: true,
        [css.activeRow]: active === task.value
      })}
      onClick={() => selectTask(task)}
    >
      <th className={classnames(css.th, css.index)}>{index + 1}</th>
      <th className={classnames(css.th, css.name)}>{task.body?.name}</th>
      <th className={classnames(css.th, css.project)}>{task.body?.project?.name || ''}</th>
      <th className={classnames(css.th, css.sprint)}>{task.body?.sprint?.name || ''}</th>
      <th className={classnames(css.th, css.small)}>{task.body?.prefix || ''}</th>
      {task.body?.author && (
          <th className={classnames(css.th, css.small)}>{lang === 'ru' ? task.body?.author.fullNameRu : task.body?.author.fullNameEn}</th>
      )}
      <th className={classnames(css.th, css.status)}>{type()}</th>
    </tr>
  );
};

ActivitiesTableRow.propTypes = {
  index: number.isRequired,
  task: shape({
    body: any.isRequired,
    label: string.isRequired,
    value: number.isRequired
  }),
  active: number,
  selectTask: func.isRequired,
  statuses: array.isRequired,
  lang: string.isRequired,
};

export default ActivitiesTableRow;
