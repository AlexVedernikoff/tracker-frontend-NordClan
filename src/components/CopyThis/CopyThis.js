import React, { PureComponent } from 'react';
import Pt from 'prop-types';
import cn from 'classnames';

import css from './CopyThis.scss';

export default class CopyThis extends PureComponent {
  static propTypes = {
    children: Pt.any,
    isCopiedBackground: Pt.bool,
    textToCopy: Pt.string.isRequired,
    wrapThisInto: Pt.any.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { copied: false, tooltipTimeoutId: null };
  }
  copy = evt => {
    evt.stopPropagation();
    clearTimeout(this.state.tooltipTimeoutId);
    this.setState({ copied: false, tooltipTimeoutId: null }, () => {
      this.refs.copy.select();
      const res = document.execCommand('copy');
      if (res) {
        this.setState({
          copied: true,
          tooltipTimeoutId: setTimeout(
            () => this.setState({ copied: false, tooltipTimeoutId: null }),
            1000
          )
        });
      }
    });
  };

  render () {
    const Wrap = this.props.wrapThisInto;
    return (
      <div className={css.copyThis}>
        <Wrap className={css.copyLink} onClick={this.copy}>
          {this.props.children}
        </Wrap>
        <span
          className={cn(css.tooltip, {
            [css.tooltipShown]: this.state.copied,
            [css.tooltipBackground]: this.props.isCopiedBackground
          })}
        >
          Copied!
        </span>
        <textarea
          ref="copy"
          className={css.copy}
          value={this.props.textToCopy}
          readOnly
        />
      </div>
    );
  }
}
