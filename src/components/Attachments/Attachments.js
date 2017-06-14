import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { IconFileDocument, IconFilePdf, IconDelete, IconDownload, IconPlus, IconEye } from '../Icons';
import FileViewer from "react-file-viewer";

export default class Attachments extends React.Component {

  render () {
    const css = require('./Attachments.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>
          <li className={css.attachment}>
            <Link to="#">
              <div className={css.attachmentIcon}>
                <IconFilePdf style={iconStyles} />
                <div className={css.actions}>
                  <button>
                    <IconDownload style={iconStyles} />
                  </button>
                  <button>
                    <IconDelete style={iconStyles} />
                  </button>
                </div>
              </div>
              <div className={css.attachmentName}>document.pdf</div>
            </Link>
          </li>
          <li className={css.attachment}>
            <Link to="#">
              <div className={css.attachmentIcon}>
                <IconFileDocument style={iconStyles} />
                <div className={css.actions}>
                  <button>
                    <IconDownload style={iconStyles} />
                  </button>
                  <button>
                    <IconDelete style={iconStyles} />
                  </button>
                </div>
              </div>
              <div className={css.attachmentName}>Сводная таблица технических требований.doc</div>
            </Link>
          </li>
          <li className={css.attachment}>
            <Link to="#">
              <div className={css.attachmentIcon}>
                <img src="http://lorempixel.com/100/100/" alt="" className={css.screen} />
                <div className={css.actions}>
                  <button>
                    <IconEye style={iconStyles} />
                  </button>
                  <button>
                    <IconDelete style={iconStyles} />
                  </button>
                </div>
              </div>
              <div className={css.attachmentName}>ScreenShot.png</div>
            </Link>
          </li>
          <li className={css.attachment}>
            <Link to="#">
              <div className={css.attachmentIcon}>
                <IconPlus style={iconStyles} />
              </div>
              <div className={css.attachmentName}>Добавить файл</div>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

Attachments.propTypes = {
  // task: PropTypes.object
};
