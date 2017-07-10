import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Priority.scss';

const Priority = props => {
  return (
    <div className={css.priority}>
      Приоритет:
      <span className={css.count}>
        {[1, 2, 3, 4, 5].map((priorityId, i) => {
          return (
            <span key={`priority-${i}`}
              className={classnames({
                [css.active]: priorityId === props.priority
              })}
            >
              {priorityId}
            </span>
          );
        })}
      </span>
    </div>
  );
};

Priority.propTypes = {};

export default Priority;
