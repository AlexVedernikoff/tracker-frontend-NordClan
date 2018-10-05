import React from 'react';
import { IconPlus } from '../Icons';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import localize from './FileUpload.json';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { lang } = this.props;
    const css = require('./FileUpload.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    return (
      <div>
        {!this.props.isMinimal ? (
          <Dropzone onDrop={this.props.onDrop} style={{}}>
            <li className={css.attachment}>
              <div className={css.attachmentIcon}>
                <IconPlus style={iconStyles} />
              </div>
              <div className={css.attachmentName}>{localize[lang].ADD_FILE}</div>
            </li>
          </Dropzone>
        ) : (
          <Dropzone onDrop={this.props.onDrop} style={{ width: 0, height: 0, border: 'none' }}>
            <IconPlus style={iconStyles} />
          </Dropzone>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

FileUpload.propTypes = {
  isMinimal: PropTypes.bool,
  lang: PropTypes.string,
  onDrop: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  null
)(FileUpload);

FileUpload.defaultProps = {
  isMinimal: false
};
