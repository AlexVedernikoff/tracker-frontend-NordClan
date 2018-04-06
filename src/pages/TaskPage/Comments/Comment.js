import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Comments.scss';
import { Link } from 'react-router';
import cn from 'classnames';
import moment from 'moment';
import { IconDeleteAnimate } from '../../../components/Icons';
import CopyThis from '../../../components/CopyThis';
import { history } from '../../../History';
import { connect } from 'react-redux';
import UserCard from '../../../components/UserCard';
import Autolinker from 'autolinker';

const UPDATE_EXPIRATION_TIMEOUT = 10 * 60 * 1000; //10 минут

class Comment extends Component {
  static getNames = person => {
    //унификация имени
    const { firstNameRu, lastNameRu, lastNameEn, firstNameEn } = person;
    const firstName = firstNameRu ? firstNameRu : firstNameEn;
    const lastName = lastNameRu ? lastNameRu : lastNameEn;
    const fullName = `${firstName} ${lastName}`;

    return { firstName, lastName, fullName };
  };

  static isExpiredForUpdate = (createdDate, loadedDate) => {
    return Comment.getLifeTime(createdDate, loadedDate) > UPDATE_EXPIRATION_TIMEOUT;
  };

  static getLifeTime = (createdDate, loadedDate) => {
    return new Date(loadedDate) - new Date(createdDate).getTime();
  };

  static selectComment = (id, location) => {
    history.replace(Comment.getHashedPath(id, location));
  };

  static getHashedPath = (id, location) => {
    return { ...location, hash: Comment.getHash(id) };
  };

  static getHash = id => {
    return `#comment-${id}`;
  };

  static getDirectionToScroll = elem => {
    if (!elem) return;

    const rect = elem.getBoundingClientRect();

    if (rect.top < 50) {
      return true;
    }

    if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight) - 50) {
      return false;
    }

    return null;
  };

  static conditionalScroll = elem =>
    Comment.deBouncedExecution(() => {
      if (!elem) return;
      const direction = Comment.getDirectionToScroll(elem);
      if (direction !== null) {
        elem.scrollIntoView(direction);
      }
    });

  static deBouncedExecution = fn => {
    const delay = 100;
    setTimeout(fn, delay);
  };

  static propTypes = {
    comment: PropTypes.object,
    commentsLoadedDate: PropTypes.string,
    editComment: PropTypes.func,
    lightened: PropTypes.bool,
    location: PropTypes.object,
    ownedByMe: PropTypes.bool,
    removeComment: PropTypes.func,
    reply: PropTypes.func,
    selectComment: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { comment: { createdAt }, ownedByMe, commentsLoadedDate } = this.props;
    const lifeTime = Comment.getLifeTime(createdAt, commentsLoadedDate);
    const canBeUpdated = ownedByMe && !Comment.isExpiredForUpdate(createdAt, commentsLoadedDate);
    this.state = {
      canBeUpdated,
      timeoutId: canBeUpdated
        ? setTimeout(
            () => this.setState({ canBeUpdated: false, timeoutId: null }),
            UPDATE_EXPIRATION_TIMEOUT - lifeTime
          )
        : null
    };
  }

  componentDidMount() {
    if (this.props.lightened) {
      Comment.conditionalScroll(this.refs.comment);
    }
  }

  componentDidUpdate() {
    if (this.props.lightened) {
      Comment.conditionalScroll(this.refs.comment);
    }
  }
  render() {
    const { comment: { author, parentComment }, comment } = this.props;
    let typoAvatar = '';
    const { firstName, lastName, fullName } = Comment.getNames(author);
    if (!author.photo) {
      typoAvatar = firstName.slice(0, 1);
      if (lastName) {
        typoAvatar += lastName.slice(0, 1);
      }
      typoAvatar.toLocaleUpperCase();
    }

    return (
      <li
        ref="comment"
        className={cn(css.commentContainer, {
          [css.selected]: this.props.lightened
        })}
      >
        <div className={css.comment} onClick={() => Comment.selectComment(comment.id, this.props.location)}>
          <div className={css.ava}>
            {comment.deleting ? <IconDeleteAnimate /> : author.photo ? <img src={author.photo} /> : typoAvatar}
          </div>
          <div className={css.commentBody}>
            <div className={css.commentMeta}>
              <UserCard user={author}>
                <Link>{fullName}</Link>
              </UserCard>,&nbsp;
              {moment(comment.updatedAt).format('DD.MM.YY HH:mm')},&nbsp;
              <CopyThis
                wrapThisInto={'a'}
                description={`Ссылка на комментарий #${comment.id}`}
                textToCopy={`${location.origin}${history.createHref(
                  Comment.getHashedPath(comment.id, this.props.location)
                )}`}
              >
                {`#${comment.id}`}&nbsp;
              </CopyThis>
            </div>
            {parentComment ? (
              <div
                className={css.commentQuote}
                onClick={() => Comment.selectComment(parentComment.id, this.props.location)}
              >
                <a className={css.commentQuoteAutor}>{Comment.getNames(parentComment.author).fullName},</a>&nbsp;
                <span className={css.commentQuoteDate}>
                  {moment(parentComment.updatedAt).format('DD.MM.YY HH:mm')}:
                </span>
                <div className={css.quoteText}>«{parentComment.text}»</div>
              </div>
            ) : null}
            <div
              dangerouslySetInnerHTML={{ __html: Autolinker.link(comment.text) }}
              className={css.commentText}
              onClick={e => e.stopPropagation()}
            />
            <div className={css.commentAction}>
              {!comment.deleting ? (
                <a onClick={() => this.props.reply(comment.id)} href="#reply">
                  Ответить
                </a>
              ) : null}
              {this.state.canBeUpdated && !comment.deleting
                ? [
                    <a onClick={() => this.props.editComment(comment)} href="#reply" key={0}>
                      Редактировать
                    </a>,
                    <a onClick={() => this.props.removeComment(comment.id)} key={1}>
                      Удалить
                    </a>
                  ]
                : null}
            </div>
          </div>
        </div>
      </li>
    );
  }
}

const mapState = ({ routing: { locationBeforeTransitions: location }, Task: { commentsLoadedDate } }) => ({
  location,
  commentsLoadedDate
});

export default connect(mapState)(Comment);
