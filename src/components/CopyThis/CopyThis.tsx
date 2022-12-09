import React, { PureComponent } from 'react';
import Pt from 'prop-types';

import css from './CopyThis.scss';
import localize from './CopyThis.json';
import { isGuide } from '~/guides/utils';

class CopyThis extends PureComponent<any, any> {
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
    const copyRef = this.refs['copy'] as HTMLTextAreaElement;
    copyRef.select();
    const res = document.execCommand('copy');
    if (res) showNotification({ message: `${localize[lang].COPIED} ${description}`, type: 'success' });
  };

  render() {
    const Wrap = this.props.wrapThisInto;
    return (
      <div className={css.copyThis}>
        <Wrap className={css.copyLink} onClick={isGuide() ? () => {} : this.copy}>
          {this.props.children}
        </Wrap>
        <textarea ref="copy" className={css.copy} value={this.props.textToCopy} readOnly />
      </div>
    );
  }
}

export default CopyThis;
