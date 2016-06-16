import React, {PropTypes} from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline';
import Popover from 'material-ui/Popover/Popover';
import ContentCrate from '../../components/ContentCrate/ContentCrate';

class NewCommentBadge extends React.Component {
  static propTypes = {
    count: PropTypes.number,
    comment: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };
  static defaultProps = {
    count: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  mouseEnterHandler = (event) => {
    if (this.props.count && this.props.comment) {
      this.setState({
        anchorEl: event.currentTarget,
        open: true
      });
    }
  }

  mouseLeaveHandler = () => {
    this.setState({
      open: false
    });
  }

  render() {
    const theme = this.context.muiTheme;
    const styles = {
      badge: {
        top: '-3px',
        width: '100%',
        height: '100%',
        fontSize: 10,
        borderRadius: 'none',
        backgroundColor: 'none',
      },
      root: {
        padding: '0px',
        backgroundColor: 'none',
        cursor: 'pointer'
      },
      button: {
        padding: 0
      },
      icon: {
        width: 36,
        height: 36
      },
      comment: {
        margin: 0,
        fontSize: '0.9em'
      },
      commentInfo: {
        color: theme.rawTheme.palette.accent3Color,
        fontSize: 12,
      },
      ellipsis: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }
    };

    return (
      <div>
        <Badge
          badgeContent={this.props.count} badgeStyle={styles.badge} style={styles.root}
          onMouseOver={this.mouseEnterHandler} onMouseOut={this.mouseLeaveHandler}
        >
          <IconButton style={styles.button}>
            <ChatBubbleOutline style={styles.icon}/>
          </IconButton>
        </Badge>
        <Popover
          open={this.state.open} anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.mouseLeaveHandler}
          animated={false} useLayerForClickAway={false}
        >
          <ContentCrate style={{maxWidth: 300}}>
            <p style={{...styles.comment, ...styles.ellipsis}}>{this.props.comment}</p>
            <span style={{...styles.commentInfo, ...styles.ellipsis}}>{this.props.author}, {this.props.date}</span>
          </ContentCrate>
        </Popover>
      </div>
    );
  }
}

export default NewCommentBadge;
