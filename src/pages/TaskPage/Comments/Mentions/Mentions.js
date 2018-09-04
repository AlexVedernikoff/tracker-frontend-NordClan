import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import * as css from './Mentions.scss';

class Mentions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: this.props.suggestions,
      mention: null,
      mentions: [],
      isShownSuggestionsList: false
    };
  }
  static propTypes = {
    disabled: PropTypes.bool,
    resizeKey: PropTypes.string,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    updateCurrentCommentText: PropTypes.func,
    suggestions: PropTypes.array,
    toggleBtn: PropTypes.func
  };

  typeComment = event => {
    this.getMention(event.target.value);
    this.toggleSuggestionsList(event.target.value);
    this.props.updateCurrentCommentText(event.target.value);
    this.props.toggleBtn(event);
  };

  chooseMention = event => {
    this.props.updateCurrentCommentText(this.props.value.replace(/(@\w*)$/, `@${event.target.value} `));
    this.setState({ isShownSuggestionsList: false });
  };

  getMention = value => {
    let mention = null;
    if (/( |^)@\w*$/.test(value)) {
      mention = /(@\w+)$/.exec(value);
      mention = mention === null ? mention : mention[0].slice(1).toLowerCase();
    }
    this.setState({ mention: mention }, function() {
      this.suggestionsFilter();
    });
  };

  removeMentionedSuggestions = () => {
    const suggestions = this.props.suggestions;
    return suggestions;
  };

  suggestionsFilter = () => {
    const mention = this.state.mention;
    let filteredSuggestions = this.props.suggestions;
    if (mention !== null) {
      filteredSuggestions = this.props.suggestions.filter(
        suggestion => suggestion.fullNameEn.toLowerCase().indexOf(mention) === 0
      );
    }
    this.setState({ suggestions: filteredSuggestions });
  };

  toggleSuggestionsList = value => {
    if (/( |^)@\w*$/.test(value)) {
      this.setState({ isShownSuggestionsList: true });
    } else {
      this.setState({ isShownSuggestionsList: false });
    }
  };

  SuggestionsList = () => {
    return (
      <ul onMouseDown={this.chooseMention}>
        {this.state.suggestions.map(suggestion => (
          <option key={suggestion.id}>{suggestion.fullNameEn}</option>
        ))}
      </ul>
    );
  };

  render() {
    return (
      <div className={css.mentions}>
        <TextareaAutosize
          key={this.props.resizeKey}
          style={{ minHeight: 32 }}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          onInput={this.typeComment}
          onKeyDown={this.props.onKeyDown}
          value={this.props.value}
        />
        {this.state.isShownSuggestionsList ? this.SuggestionsList() : null}
      </div>
    );
  }
}

export default Mentions;
