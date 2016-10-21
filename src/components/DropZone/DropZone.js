/*
/* Компонент загрузки файлов Drag-and-Drop
*/

import React, {Component, PropTypes} from 'react';
import IconAddFile from 'material-ui/svg-icons/content/add-circle';
import IconRemove from 'material-ui/svg-icons/navigation/cancel';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';

class DropZoneBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  onDrop = (files) => {
    this.setState({
      files: files
    });
    console.log('Received files: ', files);
  };

  onOpenClick = () => {
    this.refs.dropzone.open();
  };

  removeImage = (index) => {
    this.setState({
      files: this.state.files.filter((file, id) => id !== index )
    });
    console.log('Remove image with index', index);
  };

  render() {
    const theme = this.context.muiTheme;
    const { css } = this.props;

    const styles = {
      dropZone: {
        borderColor: theme.rawTheme.palette.accent3Color
      },
      dropZoneActive: {
        backgroundColor: '#eaeaea'
      },
      dropZoneText: {
        color: theme.rawTheme.palette.accent3Color
      },
      dropBtnHelper: {
        color: theme.rawTheme.palette.accent3Color
      },
      iconRemove: {
        borderColor: theme.rawTheme.palette.backgroundColor,
        background: theme.rawTheme.palette.backgroundColor
      }
    };
    const renderFlatButton = (
      <FlatButton
        label="Загрузить файлы"
        secondary
        icon={<IconAddFile />}
        onClick={this.onOpenClick} />
    );
    const renderDropzone = (
      <Dropzone ref="dropzone" style={styles.dropZone} className={css.dropZone}
        onDrop={this.onDrop} activeStyle={styles.dropZoneActive}>
        <span className={css.dropZoneText} style={styles.dropZoneText}>
          Перетащите файл(ы) сюда или кликните, чтобы выбрать файлы для загрузки
        </span>
      </Dropzone>
    );
    return (
      <div className={css.wrapper}>
        <div className={css.dropBtn}>
          {renderFlatButton}
          <div className={css.dropBtnHelper} style={styles.dropBtnHelper}>
            (.jpg, .png, .psd, .doc, .xls и др.)
          </div>
        </div>
        {renderDropzone}
        {this.state.files.length > 0 ?
        <div>
          <div>Добавлен {this.state.files.length} файл...</div>
          <div className={css.imagesBlock}>
            {this.state.files.map((file, id) =>
              <div className={css.imageItem} data-image-id={id} key={id}>
                <img className={css.imageImg} key={id} src={file.preview} />
                <IconRemove style={styles.iconRemove} className={css.iconRemove}
                  onClick={this.removeImage.bind(this, id)} />
              </div>
            )}
          </div>
        </div> :
        null}
      </div>
    );
  }
}
DropZoneBlock.defaultProps = {
  css: require('./dropZone.scss')
};

DropZoneBlock.propTypes = {
  style: PropTypes.object,
  css: PropTypes.object
};

DropZoneBlock.contextTypes = {
  store: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired
};

export default DropZoneBlock;
