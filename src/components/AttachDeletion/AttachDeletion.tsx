import React from 'react';
import PropTypes from 'prop-types';
import { IconDeleteAnimate} from '../Icons';

export default class AttachDeletion extends React.Component {
  static propTypes = {
    filename: PropTypes.string
  };

  render () {
    const css = require('./AttachDeletion.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    return (
      <li className={css.attachment}>
        <a className={css.iconWrapper}>
          <div className={css.attachmentIcon}>
            <IconDeleteAnimate style={iconStyles} />
          </div>
          <div className={css.attachmentName}>
            {this.props.filename}
          </div>
        </a>
      </li>
    );
  }
}
