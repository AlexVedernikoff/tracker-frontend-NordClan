import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import cn from 'classnames';
import ReactTooltip from 'react-tooltip';

import css from './removableRow.scss';

import { IconDelete } from '../Icons';

export default class RemovableRow extends Component<any, any> {
  static defaultProps = {
    canRemove: false
  };

  static propTypes = {
    canRemove: bool,
    onClick: func,
    title: string.isRequired,
    tooltip: string
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  get editIconView() {
    const { canRemove, onClick } = this.props;

    if (canRemove) {
      return (
        <button className={css.removeButton} onClick={onClick}>
          <IconDelete />
        </button>
      );
    }

    return null;
  }

  getContainerClassName(enabled) {
    return cn(css.container, {
      [css.removable]: enabled
    });
  }

  get isDisabled() {
    const { onClick, canRemove } = this.props;

    return [typeof onClick !== 'function', !canRemove].some(Boolean);
  }

  render() {
    const { title, tooltip } = this.props;
    const isDisabled = this.isDisabled;
    const disabled = { disabled: isDisabled };

    return (
      <div className={this.getContainerClassName(!isDisabled)} {...disabled} data-tip={tooltip}>
        {title}
        {this.editIconView}
      </div>
    );
  }
}
