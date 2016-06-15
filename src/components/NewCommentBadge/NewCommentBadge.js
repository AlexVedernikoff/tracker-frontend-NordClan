import React, {PropTypes} from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline';
import Popover from 'material-ui/Popover/Popover';

class NewCommentBadge extends React.Component {
  static propTypes = {
    count: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  mouseEnterHandler = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });
  }

  mouseLeaveHandler = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div>
        <Badge
          badgeContent={this.props.count}
          badgeStyle={{top: '-3px', borderRadius: 'none', backgroundColor: 'none', fontSize: 10, width: '100%', height: '100%'}}
          style={{padding: '0px', backgroundColor: 'none', cursor: 'pointer'}}
          onMouseOver={this.mouseEnterHandler}
          onMouseOut={this.mouseLeaveHandler}
        >
          <IconButton style={{padding: 0}}>
            <ChatBubbleOutline style={{width: 36, height: 36}}/>
          </IconButton>
        </Badge>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.mouseLeaveHandler}
          animated={false}
          useLayerForClickAway={false}
        />
      </div>
    );
  }
}

export default NewCommentBadge;
