import React, { Component } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateCurrentCommentText } from '../../../../actions/Task';
import * as css from './Mentions.scss';
import cn from 'classnames';
const ru = require('convert-layout/ru');

class Mentions extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    currentComment: PropTypes.string,
    disabled: PropTypes.bool,
    getTextAreaNode: PropTypes.func,
    lang: PropTypes.string,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    setMentions: PropTypes.func,
    suggestions: PropTypes.arrayOf(PropTypes.object),
    toggleBtn: PropTypes.func,
    updateCurrentCommentText: PropTypes.func,
    value: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTextAreaNode(document.querySelector(`.${css.mentions}__input`));
  }

  typeComment = event => {
    let { value } = event.target;
    const { lang } = this.props;
    let mentions = value.match(/@[a-zA-Zа-яА-Я]+/);
    const mentionsLocaleMap = {};
    if (mentions) {
      mentions = mentions.map(mention => mention.substring(1));
      mentions.forEach(mention => {
        mentionsLocaleMap[`@${mention}`] = lang === 'ru' ? '@' + ru.fromEn(mention) : '@' + ru.toEn(mention);
      });
      Object.keys(mentionsLocaleMap).forEach(mention => {
        const regExp = new RegExp(mention, 'i');
        value = value.replace(regExp, mentionsLocaleMap[mention]);
      });
    }
    this.props.updateCurrentCommentText(value);
    this.props.toggleBtn(event);
  };

  render() {
    const { suggestions, currentComment, className, autoFocus = true } = this.props;
    return (
      <MentionsInput
        className={cn([css.mentions, className])}
        autoFocus={autoFocus}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        onChange={this.typeComment}
        displayTransform={(id, display) => `@${display}`}
        onKeyDown={this.props.onKeyDown}
        value={currentComment}
        markup="@[__display__]"
      >
        <Mention
          type="user"
          trigger="@"
          data={suggestions}
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <div className={focused ? css.focused : ''}>{highlightedDisplay}</div>
          )}
        />
      </MentionsInput>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  currentComment: state.Task.currentComment.text
});

const mapDispatchToProps = {
  updateCurrentCommentText
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mentions);
