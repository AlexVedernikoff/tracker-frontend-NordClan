import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import * as css from './Mentions.scss';

class Mentions extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    getMentions: PropTypes.func,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    resizeKey: PropTypes.string,
    suggestions: PropTypes.array,
    toggleBtn: PropTypes.func,
    updateCurrentCommentText: PropTypes.func,
    value: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      suggestions: this.props.suggestions,
      mention: null,
      mentions: [],
      isShownSuggestionsList: false
    };
  }

  typeComment = event => {
    this.getMention(event.target.value);
    this.toggleSuggestionsList(event.target.value);
    this.props.updateCurrentCommentText(event.target.value);
    this.props.toggleBtn(event);
  };

  chooseMention = event => {
    const target = event.target;
    this.props.updateCurrentCommentText(this.props.value.replace(/(@\w*)$/, `@${target.value} `));
    this.setState(
      prevState => prevState.mentions.push({ id: target.id, name: target.value.toLowerCase() }),
      function() {
        this.props.getMentions(this.state.mentions);
      }
    );
    this.setState({ isShownSuggestionsList: false });
  };

  getMention = value => {
    let mention = null;
    if (/( |^)@\w*$/.test(value)) {
      mention = /(@\w+)$/.exec(value);
      mention = mention === null ? mention : mention[0].slice(1).toLowerCase();
    }
    this.setState({ mention: mention }, function() {
      this.suggestionsFilter(value);
    });
  };

  suggestionsFilter = value => {
    let mentions = this.state.mentions;
    const mention = this.state.mention;
    let filteredSuggestions = this.props.suggestions;
    if (value.toLowerCase().indexOf('@all') !== -1) {
      this.setState({ suggestions: [] });
    } else {
      this.state.mentions.map(ment => {
        if (value.toLowerCase().indexOf(`@${ment.name}`) !== -1) {
          filteredSuggestions = filteredSuggestions.filter(
            suggestion => suggestion.fullNameEn.toLowerCase() !== ment.name.toLowerCase()
          );
        } else {
          mentions = mentions.filter(el => el.name !== ment.name);
        }
      });
      this.setState({ mentions }, function() {
        this.props.getMentions(this.state.mentions);
      });
      if (mention !== null) {
        filteredSuggestions = filteredSuggestions.filter(
          suggestion =>
            suggestion.fullNameEn.toLowerCase().indexOf(mention) === 0 && this.state.mentions.indexOf(mention) === -1
        );
      }
      this.setState({ suggestions: filteredSuggestions });
    }
  };

  toggleSuggestionsList = value => {
    if (/( |^)@\w*$/.test(value)) {
      this.setState({ isShownSuggestionsList: true });
    } else {
      this.setState({ isShownSuggestionsList: false });
    }
  };

  suggestionsList = () => {
    return (
      <ul onMouseDown={this.chooseMention}>
        {this.state.suggestions.map(suggestion => (
          <option key={suggestion.id} id={suggestion.id}>
            {suggestion.fullNameEn}
          </option>
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
        {this.state.isShownSuggestionsList ? this.suggestionsList() : null}
      </div>
    );
  }
}

export default Mentions;
