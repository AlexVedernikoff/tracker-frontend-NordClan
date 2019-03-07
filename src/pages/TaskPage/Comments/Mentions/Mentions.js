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
    const { value } = event.target;
    const { lang } = this.props;
    const correctValue = value.split('@');
    if (lang === 'ru' && correctValue[1].length) {
      correctValue[1] = ru.fromEn(correctValue[1]);
    }
    if (lang === 'en' && correctValue[1].length) {
      correctValue[1] = ru.toEn(correctValue[1]);
    }
    this.props.updateCurrentCommentText(correctValue.join('@'));
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
