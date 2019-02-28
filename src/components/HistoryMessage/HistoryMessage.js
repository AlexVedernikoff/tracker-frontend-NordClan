import React from 'react';
import Pt from 'prop-types';
import { Link } from 'react-router';
import UserCard from '../UserCard';
import * as css from './HistoryMessage.scss';
import { getFullName } from '../../utils/NameLocalisation';

export default class HistoryMessage extends React.Component {
  static propTypes = {
    entities: Pt.object,
    message: Pt.string,
    projectId: Pt.number
  };

  constructor(props) {
    super(props);
    this.maxLengthTextMessage = 100;
    this.messageWithoutTags = this.deleteHtmlTags(this.props.message);
    this.setInitialState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message) {
      this.messageWithoutTags = this.deleteHtmlTags(nextProps.message);
    }
  }

  setInitialState() {
    if (this.isTextMessage()) {
      this.state = {
        isLongText: this.messageWithoutTags.length > this.maxLengthTextMessage,
        isOpen: false
      };
    }
  }

  isTextMessage() {
    const { entities } = this.props;
    return !entities || Object.keys(entities).length === 0;
  }

  deleteHtmlTags(message) {
    const regex = /(<([^>]+)>)/gi;
    return message.replace(regex, '').replace(/&nbsp;/g, '');
  }

  renderTextMessage() {
    const shortText = this.messageWithoutTags.slice(0, this.maxLengthTextMessage).concat('...');

    if (this.state.isLongText) {
      return (
        <div className={css.longText} onClick={this.switchState}>
          {this.state.isOpen ? this.messageWithoutTags : shortText}
        </div>
      );
    }
    return <div className={css.normalText}>{this.messageWithoutTags}</div>;
  }

  switchState = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderMessageWithAdditions() {
    const { message } = this.props;
    const additions = message.split(/[{}]/);
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
      case 'user':
        return (
          <UserCard user={entities[addition]} key={key}>
            <Link>{getFullName(entities[addition])}</Link>
          </UserCard>
        );
      case 'linkedTask':
      case 'parentTask':
      case 'prevParentTask':
        return (
          <Link to={`/projects/${projectId}/tasks/${entities[addition].task.id}`} key={key}>
            {entities[addition].task.name}
          </Link>
        );
      case 'sprint':
      case 'prevSprint':
        return (
          <Link to={`/projects/${projectId}/tasks?sprintId=${entities[addition].id}`} key={key}>
            {entities[addition].name}
          </Link>
        );
      case 'portfolio':
        return entities[addition] ? (
          <Link to={`/projects/portfolio/${entities[addition].id}`} key={key}>
            {entities[addition].name}
          </Link>
        ) : null;
      case 'file':
        // реализовать потом
        break;
      default:
        break;
    }
  }

  render() {
    const message = this.isTextMessage() ? this.renderTextMessage() : this.renderMessageWithAdditions();

    return <div className={css.normalText}>{message}</div>;
  }
}
