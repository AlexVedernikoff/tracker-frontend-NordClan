import React, { PropTypes } from 'react';
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
    date: PropTypes.string,
    css: PropTypes.object
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
    const { css } = this.props;
    const styles = {
      badge: {
        top: '-2px',
        width: '100%',
        height: '100%',
        fontSize: 10,
        borderRadius: 'none',
        backgroundColor: 'none'
      },
      commentInfo: {
        color: theme.rawTheme.palette.accent3Color
      }
    };
    return (
      <div>
        <Badge
          badgeContent={this.props.count} badgeStyle={styles.badge} className={css.root}
          onMouseOver={this.mouseEnterHandler} onMouseOut={this.mouseLeaveHandler}
        >
          <IconButton className={css.button}>
            <ChatBubbleOutline className={css.icon} />
          </IconButton>
        </Badge>
        <Popover
          open={this.state.open} anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.mouseLeaveHandler}
          animated={false} useLayerForClickAway={false}
        >
          <ContentCrate style={{ maxWidth: 300 }}>
            <p className={css.comment}>{this.props.comment}</p>
            <span className={css.commentInfo} style={styles.commentInfo}>{this.props.author}, {this.props.date}</span>
          </ContentCrate>
        </Popover>
      </div>
    );
  }
}

NewCommentBadge.defaultProps = {
  css: require('./newCommentBadge.scss')
};

export default NewCommentBadge;
