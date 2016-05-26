import React from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline';

const NewCommentBadge = () => (
  <div>
    <Badge
      badgeContent={10}
      badgeStyle={{top: 4, right: 7, borderRadius: 'none', width: 'none', height: 'none', backgroundColor: 'none', fontSize: 10}}
      style={{padding: '0px', backgroundColor: 'none' }}
    >
      <IconButton tooltip="Notifications" style={{width: 'none', height: 'none', padding: 0}}>
        <ChatBubbleOutline style={{width: 30, height: 30}}/>
      </IconButton>
    </Badge>
  </div>
);

export default NewCommentBadge;
