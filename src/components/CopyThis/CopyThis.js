import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Pt from 'prop-types';

import { showNotification } from '../../actions/Notifications';
import css from './CopyThis.scss';

class CopyThis extends PureComponent {
  static propTypes = {
    children: Pt.any,
    description: Pt.string,
    isCopiedBackground: Pt.bool,
    showNotification: Pt.func.isRequired,
    textToCopy: Pt.string.isRequired,
    wrapThisInto: Pt.any.isRequired
  };

  constructor(props) {
    super(props);
  }

  copy = evt => {
    evt.stopPropagation();
    this.refs.copy.select();
    const res = document.execCommand('copy');
    if (res) this.props.showNotification({ message: `Скопировано: ${this.props.description}`, type: 'success' });
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

const mapDispatchToProps = {
  showNotification
};

export default connect(
  null,
  mapDispatchToProps
)(CopyThis);
