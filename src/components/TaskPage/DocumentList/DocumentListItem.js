import React, { Component, PropTypes } from 'react';
import ListItem from 'material-ui/List/ListItem';
import DownloadFile from 'material-ui/svg-icons/file/file-download';
import IconButton from 'material-ui/IconButton';
import NavCancel from 'material-ui/svg-icons/navigation/cancel';
import AttachFile from 'material-ui/svg-icons/editor/attach-file';
import CloudDownload from 'material-ui/svg-icons/file/cloud-download';

export default class DocumentListItem extends Component {
  static propTypes = {
    title: PropTypes.string,
    format: PropTypes.string,
    type: PropTypes.string
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      docItemRightIco: {
        fill: theme.rawTheme.palette.accent3Color
      }
    };
    return styles;
  }

  handleMouseEnter = () => {};
  handleMouseLeave = () => {};
  handleTouchTap = (event) => {
    console.log('event.target', event.target);
    console.log('DOWNLOAD attached file', event.target.id);
  };

  handleRemoveDocItem = (event) => {
    console.log('REMOVE attached file', event.target.id);
  };

  render() {
    const styles = this.getStyles();
    const { title, format, type } = this.props;

    const listItemRemoveIcon = (
      <IconButton tooltip="Удалить" tooltipPosition="bottom-right" onClick={this.handleRemoveDocItem}>
        <NavCancel style={styles.docItemRightIco}/>
      </IconButton>
    );

    const iconType = {
      DownloadFile: <DownloadFile />,
      CloudDownload: <CloudDownload />,
      AttachFile: <AttachFile />
    };

    return (
      <ListItem
        primaryText={<span>{title}</span>}
        secondaryText={format} secondaryTextLines={1}
        leftIcon={iconType[type]}
        rightIconButton={listItemRemoveIcon}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchTap={this.handleTouchTap}
      />
    );
  }
}
