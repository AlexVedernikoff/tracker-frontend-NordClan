import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import * as css from './Mentions.scss';

class Mentions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: this.props.suggestions,
      showSuggestionsList: false
    };
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
    this.getSuggestions(evt.target.value, this.props.suggestions);
    this.props.updateCurrentCommentText(evt.target.value);
    this.props.toggleBtn(evt);
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

  getSuggestions = (value, suggestions) => {
    if (/@/.test(value)) {
      const mention = /((@\w+ \w+)|(@\w+))$/.exec(value);
      const mentions = this.getMentions(value);
      if (mention === null) {
        this.setState({
          suggestions: this.props.suggestions,
          showSuggestionsList: true
        });
        return null;
      }
      const filtered = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(mention[1].slice(1).toLowerCase()) === 0 &&
          mentions.indexOf(suggestion) === -1
      );
      this.setState({
        suggestions: filtered,
        showSuggestionsList: true
      });
    } else {
      this.setState({
        suggestions: this.props.suggestions,
        showSuggestionsList: false
      });
    }
  };

  //getSuggestions = (value, suggestions) => {
  //  if (/@/.test(value)) {
  //    const mention = /((@\w+ \w+)|(@\w+))$/.exec(value);
  //    const mentions = this.getMentions(value);
  //    mentions.pop();
  //    if (mention === null) {
  //      this.setState({suggestions: this.props.suggestions});
  //      return true;
  //    }
  //    const filtered = suggestions.filter(
  //      suggestion =>
  //        suggestion.toLowerCase().indexOf(mention[1].slice(1).toLowerCase()) === 0 &&
  //        mentions.indexOf(suggestion) === -1
  //    );
  //    this.setState({suggestions: filtered});
  //  }
  //};

  showSuggestions = () => {
    if (this.state.showSuggestionsList) {
      return <ul>{this.state.suggestions.map(member => <li>{member}</li>)}</ul>;
    }
  };

  render() {
    return (
      <div className={css.mentions}>
        <TextareaAutosize
          key={this.props.key}
          style={{ minHeight: 32 }}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          onInput={this.typeComment}
          onKeyDown={this.props.onKeyDown}
          value={this.props.value}
        />
        <ul>{this.showSuggestions()}</ul>
      </div>
    );
  }
}

export default Mentions;
