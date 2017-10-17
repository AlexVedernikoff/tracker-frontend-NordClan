import React from 'react';
import { Link } from 'react-router';
import UserCard from '../UserCard';
import * as css from './TaskHistoryMessage.scss';

export default class TaskHistoryMessage extends React.Component {
  constructor(props) {
    super(props);
    this.maxLengthTextMessage = 100;
    this.messageWithoutTags = this.deleteHtmlTags(this.props.message);
    this.setInitialState();
  }

  setInitialState() {
    if (this.isTextMessage()) {
      this.state = {
        isLongText: this.messageWithoutTags.length > this.maxLengthTextMessage,
        isOpen: false
      }
    }
  }

  isTextMessage() {
    const { entities } = this.props;
    return Object.keys(entities).length === 0;
  }

  deleteHtmlTags(message) {
    const regex = /(<([^>]+)>)/ig;
    return message.replace(regex, '');
  }

  renderTextMessage() {
    const { message } = this.props;
    const shortText = this.messageWithoutTags
      .slice(0, this.maxLengthTextMessage)
      .concat('...');

    if (this.state.isLongText) {
      return <div className={css.longText} onClick={this.switchState}>
        { this.state.isOpen ? this.messageWithoutTags : shortText }
      </div>;
    }
    return <div className={css.normalText}>
      { this.messageWithoutTags }
    </div>;
  }

  switchState = () => {
    this.setState({ isOpen: !this.state.isOpen });
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
    });
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
      this.renderMessageWithAdditions();

    return <div className={css.normalText}>{message}</div>;
  }
}
