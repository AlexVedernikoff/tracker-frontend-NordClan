import React, { PureComponent } from 'react';
import { bool, func, string } from 'prop-types';
import cn from 'classnames';
import ReactTooltip from 'react-tooltip';

import * as css from './editableRow.scss';

import { IconEdit } from '../Icons';

export default class EditableRow extends PureComponent {
  static defaultProps = {
    canEdit: false
  };

  static propTypes = {
    canEdit: bool,
    onClick: func,
    title: string,
    tooltip: string
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  get editIconView() {
    const { canEdit } = this.props;

    if (canEdit) {
      return (
        <span className={css.editIcon}>
          <IconEdit />
        </span>
      );
    }

    return null;
  }

  getContainerClassName(isEditable) {
    return cn(css.container, {
      [css.editable]: isEditable
    });
  }

  get isDisabled() {
    const { onClick, canEdit } = this.props;

    return [typeof onClick !== 'function', !canEdit].some(Boolean);
  }

  render() {
    const { title, tooltip, onClick, canEdit } = this.props;
    const isDisabled = this.isDisabled;

    return (
      <button
        className={this.getContainerClassName(!isDisabled)}
        disabled={isDisabled}
        onClick={canEdit ? onClick : undefined}
        data-tip={tooltip}
      >
        {title}
        {this.editIconView}
      </button>
    );
  }
}
