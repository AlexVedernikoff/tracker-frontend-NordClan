/*
/* Компонент загрузки файлов Drag-and-Drop
*/

import React, {Component, PropTypes} from 'react';
import IconAddFile from 'material-ui/lib/svg-icons/content/add-circle';
import IconRemove from 'material-ui/lib/svg-icons/navigation/cancel';
import FlatButton from 'material-ui/lib/flat-button';
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
    // console.log(theme);
    // console.log('this.state.files', typeof(this.state.files));
    // console.log('this.state.files[2]', this.state.files[2]);

    const styles = {
      wrapper: {
        marginBottom: 120
      },
      dropZone: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        // borderTop: '1px solid transparent',
        // borderBottom: '1px solid transparent',
        border: '1px dashed transparent',
        borderColor: theme.rawTheme.palette.accent3Color
        // backgroundColor: '#eaeaea'
      },
      dropZoneActive: {
        backgroundColor: '#eaeaea'
      },
      dropZoneText: {
        fontSize: 14,
        textAlign: 'center',
        color: theme.rawTheme.palette.accent3Color
      },
      dropBtn: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20
      },
      // dropBtnButton: {
      //   cursor: 'pointer',
      //   position: 'absolute',
      //   top: '0',
      //   bottom: '0',
      //   right: '0',
      //   left: '0',
      //   width: '100%',
      //   opacity: '0',
      //   zIndex: 1
      // },
      dropBtnHelper: {
        fontSize: '14px',
        color: theme.rawTheme.palette.accent3Color,
        marginLeft: 20
      },
      imagesBlock: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginRight: '-8px',
        marginLeft: '-8px'
      },
      imageItem: {
        position: 'relative',
        width: '25%',
        height: 'auto',
        padding: '8px',
        boxSizing: 'border-box'
      },
      imageImg: {
        width: '100%',
        height: 'auto'
      },
      iconRemove: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        cursor: 'pointer',
        fill: '#a5a5a5',
        border: '2px solid transparent',
        borderColor: theme.rawTheme.palette.backgroundColor,
        borderRadius: '50%',
        background: theme.rawTheme.palette.backgroundColor
      }
    };
    return (
      <div style={styles.wrapper}>
        <div style={styles.dropBtn}>
          <FlatButton
            label="Загрузить файлы"
            secondary
            icon={<IconAddFile />}
            onClick={this.onOpenClick}
          />
          <div style={styles.dropBtnHelper}>(.jpg, .png, .psd, .doc, .xls и др.)</div>
        </div>
        <Dropzone ref="dropzone" onDrop={this.onDrop} style={styles.dropZone} activeStyle={styles.dropZoneActive}>
          <span style={styles.dropZoneText}>Перетащите файл(ы) сюда или кликните, чтобы выбрать файлы для загрузки</span>
        </Dropzone>
        {this.state.files.length > 0 ?
        <div>
          <div>Добавлен {this.state.files.length} файл...</div>
          <div style={styles.imagesBlock}>
            {this.state.files.map((file, id) =>
              <div style={styles.imageItem} data-image-id={id} key={id}>
                <img style={styles.imageImg} key={id} src={file.preview} />
                <IconRemove style={styles.iconRemove} onClick={this.removeImage.bind(this, id)}/>
              </div>
            )}

          </div>
        </div> :
        null}
      </div>
    );
  }
}

DropZoneBlock.propTypes = {
  style: PropTypes.object
};

DropZoneBlock.contextTypes = {
  store: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired
};

// DropZoneBlock.defaultProps = {
//
// };

export default DropZoneBlock;
