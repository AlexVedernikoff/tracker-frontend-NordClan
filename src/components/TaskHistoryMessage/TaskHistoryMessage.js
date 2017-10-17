import React from 'react';
import { Link } from 'react-router';
import UserCard from '../UserCard';
import * as css from './TaskHistoryMessage.scss';

export default class TaskHistoryMessage extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialState();
  }

  setInitialState() {
    if (this.isTextMessage()) {
      const { message } = this.props;
      const messageWithoutTags = this.deleteHtmlTags(message);
      this.state = {
        isLongText: messageWithoutTags.length > this.maxLengthTextMessage(),
        isOpen: false
      }
    }
  }

  isTextMessage() {
    const { entities } = this.props;
    return Object.keys(entities).length === 0;
  }

  maxLengthTextMessage() {
    return 100;
  }

  deleteHtmlTags(message) {
    const regex = /(<([^>]+)>)/ig;
    return message.replace(regex, '');
  }

  renderTextMessage() {
    const { message } = this.props;
    const messageWithoutTags = this.deleteHtmlTags(message);
    const shortText = messageWithoutTags
      .slice(0, this.maxLengthTextMessage())
      .concat('...');

    const visibleText = this.state.isOpen ? messageWithoutTags : shortText;
    const className = this.state.isLongText ? css.longText : css.normalText;
    const onClick = this.state.isLongText ? this.switchState.bind(this) : null;

    return <div className={className} onClick={onClick}>
      { this.state.isLongText ? visibleText : messageWithoutTags }
    </div>
  }

  switchState() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  renderMessageWithAdditions() {
    const { message } = this.props;
    const additions = message.split(/[{}]/).slice(0, -1);
    return additions.map((addition, i) => {
      if (i % 2 === 0) {
        return <span key={i}>{addition}</span>;
      } else {
        return this.getAdditionalInfo(addition, i);
      }
    })
  }

  getAdditionalInfo(addition, key) {
    const { entities, projectId } = this.props;
    switch (addition) {
      case 'prevPerformer':
      case 'performer':
        return <UserCard user={entities[addition]} key={key}>
          <Link>{entities[addition].fullNameRu}</Link>
        </UserCard>;
      case 'linkedTask':
      case 'parentTask':
      case 'prevParentTask':
        return <Link to={`/projects/${projectId}/tasks/${entities[addition].task.id}`} key={key}>
          {entities[addition].task.name}
        </Link>;
      case 'sprint':
      case 'prevSprint':
        return <Link to={`/projects/${projectId}/sprint${entities[addition].id}/tasks`} key={key}>
          {entities[addition].name}
        </Link>;
      case 'file':
        // реализовать потом
        break;
      default:
        break;
    }
  }

  render() {
    const message = this.isTextMessage() ?
      this.renderTextMessage() :
      this.renderMessageWithAdditions()

    return <div className={css.normalText}>{message}</div>
  }
}
