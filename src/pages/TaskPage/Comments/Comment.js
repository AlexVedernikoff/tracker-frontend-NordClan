import React, { PureComponent } from 'react';
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
import localize from './Comment.json';
import { getFirstName, getLastName, getFullName } from '../../../utils/NameLocalisation';

import { parseCommentForDisplay, prepairCommentForEdit } from './Mentions/mentionService';

const UPDATE_EXPIRATION_TIMEOUT = 10 * 60 * 1000; //10 минут

class Comment extends PureComponent {
  static getNames = person => {
    //унификация имени
    const firstName = getFirstName(person);
    const lastName = getLastName(person);
    const fullName = getFullName(person);

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
    lang: PropTypes.string,
    lightened: PropTypes.bool,
    location: PropTypes.object,
    ownedByMe: PropTypes.bool,
    removeComment: PropTypes.func,
    reply: PropTypes.func,
    selectComment: PropTypes.func,
    users: PropTypes.array
  };

  constructor(props) {
    super(props);
    const {
      comment: { createdAt },
      ownedByMe,
      commentsLoadedDate
    } = this.props;
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

  handleSelect = e => {
    Comment.selectComment(this.props.comment.id, this.props.location);
  };

  getCard = (user, i) => {
    if (user.id === 'all') {
      return this.getBold(user, i);
    }
    const name = getFullName(user);
    return (
      <UserCard key={name + i} user={user}>
        <strong>{name}</strong>
      </UserCard>
    );
  };

  getBold = (s, i) => `<strong key={${getFullName(s) + i}}>${getFullName(s)}</strong>`;

  getMention = user => `@${getFullName(user)}`;

  compileComment = text =>
    parseCommentForDisplay(text, this.props.users, this.getCard).map(
      t => (typeof t === 'string' ? Autolinker.link(t) : t)
    );

  compileParent = text => parseCommentForDisplay(text, this.props.users, this.getBold).join('');

  prepairTextForEditing = text => prepairCommentForEdit(text, this.props.users, this.getMention);

  render() {
    const {
      comment: { author, parentComment, text },
      comment,
      lang
    } = this.props;

    let typoAvatar = '';
    const { firstName, lastName, fullName } = Comment.getNames(author);
    if (!author.photo) {
      typoAvatar = firstName.slice(0, 1);
      if (lastName) {
        typoAvatar += lastName.slice(0, 1);
      }
      typoAvatar.toLocaleUpperCase();
    }
    const editingComment = { ...comment, text: this.prepairTextForEditing(comment.text) };
    return (
      <li
        data-key="textContainer"
        ref="comment"
        onClick={this.handleSelect}
        className={cn(css.commentContainer, {
          [css.selected]: this.props.lightened
        })}
      >
        <div className={css.comment}>
          <div className={css.ava}>
            {comment.deleting ? <IconDeleteAnimate /> : author.photo ? <img src={author.photo} /> : typoAvatar}
          </div>
          <div className={css.commentBody}>
            <div className={css.commentMeta}>
              <UserCard user={author}>
                <Link>{fullName}</Link>
              </UserCard>
              ,&nbsp;
              {moment(comment.updatedAt).format('DD.MM.YY HH:mm')}
              ,&nbsp;
              <CopyThis
                wrapThisInto={'a'}
                description={`${localize[lang].COMMENT_LINK}${comment.id}`}
                textToCopy={`${location.origin}${history.createHref(
                  Comment.getHashedPath(comment.id, this.props.location)
                )}`}
              >
                {`#${comment.id}`}
                &nbsp;
              </CopyThis>
            </div>
            {parentComment ? (
              <div
                className={css.commentQuote}
                onClick={() => Comment.selectComment(parentComment.id, this.props.location)}
              >
                <a className={css.commentQuoteAutor}>{Comment.getNames(parentComment.author).fullName},</a>
                &nbsp;
                <span className={css.commentQuoteDate}>
                  {moment(parentComment.updatedAt).format('DD.MM.YY HH:mm')}:
                </span>
                <div
                  className={css.quoteText}
                  dangerouslySetInnerHTML={{ __html: `«${this.compileParent(parentComment.text)}»` }}
                />
              </div>
            ) : null}
            <div className={css.commentText}>
              {this.compileComment(text).map(
                (t, i) => (typeof t === 'string' ? <span key={t + i} dangerouslySetInnerHTML={{ __html: t }} /> : t)
              )}
            </div>
            <div className={css.commentAction}>
              {!comment.deleting ? (
                <a onClick={() => this.props.reply(comment.id)} href="#reply">
                  {localize[lang].REPLY}
                </a>
              ) : null}
              {this.state.canBeUpdated && !comment.deleting
                ? [
                    <a onClick={() => this.props.editComment(editingComment)} href="#reply" key={0}>
                      {localize[lang].EDIT}
                    </a>,
                    <a onClick={() => this.props.removeComment(comment.id)} key={1}>
                      {localize[lang].REMOVE}
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

const mapState = ({
  routing: { locationBeforeTransitions: location },
  Task: { commentsLoadedDate },
  Localize: { lang }
}) => ({
  location,
  commentsLoadedDate,
  lang
});

export default connect(mapState)(Comment);
