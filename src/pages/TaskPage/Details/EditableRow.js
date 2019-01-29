import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconEdit } from '../../../components/Icons';

import * as css from './Details.scss';

const EditableRow = ({ title, value, handler, canEdit }) => {
  return (
    <tr>
      <td>{title}</td>
      <td>
        <span
          className={classnames({
            [css.editableCell]: true,
            [css.editableCell__canEdit]: canEdit
          })}
          onClick={canEdit ? handler : undefined}
        >
          {value}

          {canEdit && (
            <span className={css.editIcon}>
              <IconEdit />
            </span>
          )}
        </span>
      </td>
    </tr>
  );
};

EditableRow.propTypes = {
  canEdit: PropTypes.bool,
  handler: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.string
};

export default EditableRow;
