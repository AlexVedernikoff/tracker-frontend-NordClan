import React from 'react';
import { Value } from 'react-select';
import classnames from 'classnames';
import { customSelectValue, customSelectValueName, customSelectValueBudget } from './SprintSelector.scss';
import PropTypes from 'prop-types';

const getSprintTime = (sprintId, sprints) => {
  const projectSprints = sprints;
  if (sprintId && Array.isArray(projectSprints)) {
    const sprintData = projectSprints.find(data => data.id === +sprintId) || {};
    return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
  } else return '';
};

export const SprintSelectorValueWithBudget = props => {
  const { sprintId, projectSprints, containerClassName } = props;
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
      <span className={customSelectValueBudget}>{getSprintTime(sprintId, projectSprints)}</span>
    </div>
  );
};

SprintSelectorValueWithBudget.propTypes = {
  containerClassName: PropTypes.string,
  projectSprints: PropTypes.array,
  sprintId: PropTypes.number
};

export default SprintSelectorValueWithBudget;
