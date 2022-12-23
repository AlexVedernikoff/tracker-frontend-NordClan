import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconEdit, IconPlus, IconDelete } from '../../components/Icons';

import css from './TestingCase.scss';

type PropsType = {
  title: string;
  value: string | number;
  haveValue?: boolean;
  editHandler: () => void;
  createHandler?: () => void;
  deleteHandler?: () => void;
}

const EditableRow = ({ title, value, editHandler, createHandler, haveValue, deleteHandler }: PropsType) => {
  return (
    <tr>
      <td>{title}</td>
      <td>
        <span
          className={classnames({
            [css.editableCell]: true,
            [css.editableCell__canEdit]: !!editHandler
          })}
        >
          <span onClick={editHandler}>{value}</span>

          {haveValue && !!deleteHandler && (
            <span className={css.editIcon} onClick={deleteHandler}>
              <IconDelete />
            </span>
          )}
          {!!editHandler && (
            <span className={css.editIcon} onClick={editHandler}>
              <IconEdit />
            </span>
          )}
          {!!createHandler && (
            <span className={css.editIcon} onClick={createHandler}>
              <IconPlus />
            </span>
          )}
        </span>
      </td>
    </tr>
  );
};

(EditableRow as any).propTypes = {
  canEdit: PropTypes.bool,
  handler: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.string
};

export default EditableRow;
