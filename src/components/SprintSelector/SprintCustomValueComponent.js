import React from 'react';
import { Value } from 'react-select';
import classnames from 'classnames';
import { customSelectValue, customSelectValueName, customSelectValueBudget } from './SprintSelector.scss';

const getSprintTime = (sprintIds, sprints) => {
  const projectSprints = sprints;
  if (sprintIds && projectSprints && projectSprints.length) {
    const sprintData = projectSprints.find(data => data.id === +sprintIds) || {};
    return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
  } else return '';
};

export default props => {
  const { sprintIds, projectSprints, containerClassName } = props;
  return (
    <div
      title={props.value.label}
      className={classnames({
        'Select-custom-value': true,
        [customSelectValue]: true,
        [containerClassName]: !!containerClassName
      })}
    >
      <Value {...props} value={{ ...props.value, className: `${props.value.className} ${customSelectValueName}` }} />
      <span className={customSelectValueBudget}>{getSprintTime(sprintIds, projectSprints)}</span>
    </div>
  );
};
