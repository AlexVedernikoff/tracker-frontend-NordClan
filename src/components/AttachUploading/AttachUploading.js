import React from 'react';
import PropTypes from 'prop-types';
import { IconCircleProgressBar } from '../Icons';
import { getTruncatedFilename } from '../Attachments/Attachments';

export default class AttachUploading extends React.Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    progress: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirmDeleteOpen: false
    };
  }

  render() {
    const css = require('./AttachUploading.scss');

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
        <div className={css.attachmentName} title={fileName}>
          {getTruncatedFilename(fileName)}
        </div>
      </li>
    );
  }
}
