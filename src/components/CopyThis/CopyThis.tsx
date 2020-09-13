import React, { PureComponent } from 'react';
import Pt from 'prop-types';

import css from './CopyThis.scss';
import localize from './CopyThis.json';

class CopyThis extends PureComponent {
  static propTypes = {
    children: Pt.any,
    description: Pt.string,
    isCopiedBackground: Pt.bool,
    lang: Pt.string,
    showNotification: Pt.func.isRequired,
    textToCopy: Pt.string.isRequired,
    wrapThisInto: Pt.any.isRequired
  };

  constructor(props) {
    super(props);
  }

  copy = evt => {
    const { lang, description, showNotification } = this.props;
    evt.stopPropagation();
    this.refs.copy.select();
    const res = document.execCommand('copy');
    if (res) showNotification({ message: `${localize[lang].COPIED} ${description}`, type: 'success' });
  };

  render() {
    const Wrap = this.props.wrapThisInto;
    return (
      <div className={css.copyThis}>
        <Wrap className={css.copyLink} onClick={this.copy}>
          {this.props.children}
        </Wrap>
        <textarea ref="copy" className={css.copy} value={this.props.textToCopy} readOnly />
      </div>
    );
  }
}

export default CopyThis;
