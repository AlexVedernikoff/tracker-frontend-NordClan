import React, { Component } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateCurrentCommentText } from '../../../../actions/Task';
import css from './Mentions.scss';
import cn from 'classnames';

class Mentions extends Component<any, any> {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    currentComment: PropTypes.string,
    disabled: PropTypes.bool,
    getTextAreaNode: PropTypes.func,
    lang: PropTypes.string,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func,
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
        onPaste={(e) => this.props.onPaste(e)}
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
