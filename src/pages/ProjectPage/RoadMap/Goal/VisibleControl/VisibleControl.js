import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { IconEye } from '../../../../../components/Icons';
import localize from '../localize.json';
import styles from './VisibleControl.scss';

class VisibleControl extends Component {
  static propTypes = {
    lang: PropTypes.string,
    onClick: PropTypes.func,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClick, lang } = this.props;
    const classnames = cn(styles.visibleControl, { [styles.invisible]: !visible });
    const tip = visible ? localize[lang].VISIBLE_GOAL : localize[lang].HIDDEN_GOAL;

    return (
      <div className={classnames} data-tip={tip}>
        <IconEye onClick={onClick} />
      </div>
    );
  }
}

export default VisibleControl;
