import React from 'react';
import PropTypes from 'prop-types';
import { IconCircleProgressBar } from '../Icons';
import css from './AttachUploading.scss';

export default class AttachUploading extends React.Component<any, any> {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    progress: PropTypes.number
  };

  constructor (props) {
    super(props);
    this.state = {
      isConfirmDeleteOpen: false
    };
  }

  render () {
    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const { fileName, progress } = this.props;

    return (
      <li className={css.attachment}>
        <div className={css.attachmentIcon}>
          <IconCircleProgressBar style={iconStyles} progress={progress} />
        </div>
        <div className={css.attachmentName}>
          {fileName}
        </div>
      </li>
    );
  }
}
