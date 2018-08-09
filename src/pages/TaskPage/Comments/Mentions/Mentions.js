import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';

class Mentions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    disabled: PropTypes.bool,
    key: PropTypes.string,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    updateCurrentCommentText: PropTypes.func,
    suggestions: PropTypes.array,
    toggleBtn: PropTypes.func
  };

  typeComment = evt => {
    this.showSuggestions(evt.target.value, this.props.suggestions);
    this.props.updateCurrentCommentText(evt.target.value);
    this.props.toggleBtn();
  };

  getMentions = str => {
    const regEx = /(@\w+ \w+)|(@\w+)/g;
    let match = [];
    const entities = [];
    while ((match = regEx.exec(str)) !== null) {
      entities.push(match[0].trim().slice(1));
    }
    return entities;
  };

  showSuggestions = (value, suggestions) => {
    if (/@/.test(value)) {
      const mention = /((@\w+ \w+)|(@\w+))$/.exec(value);
      const mentions = this.getMentions(value);
      mentions.pop();
      if (mention === null) {
        return suggestions;
      }
      const filtered = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(mention[1].slice(1).toLowerCase()) === 0 &&
          mentions.indexOf(suggestion) === -1
      );
      return filtered;
    }
  };
  render() {
    return (
      <div>
        <TextareaAutosize
          key={this.props.key}
          style={{ minHeight: 32 }}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          onInput={this.typeComment}
          onKeyDown={this.props.onKeyDown}
          value={this.props.value}
        />
      </div>
    );
  }
}

export default Mentions;
