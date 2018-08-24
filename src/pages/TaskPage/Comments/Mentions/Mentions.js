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
    this.suggestionsFilter();
    this.toggleSuggestionsList(event.target.value);
    //this.getMentions(event.target.value);
    //this.getSuggestions(event.target.value);
    this.props.updateCurrentCommentText(event.target.value);
    this.props.toggleBtn(event);
  };

  //getMentions = str => {
  //  const regEx = /(@\S+ \S+)|(@\S+)/g;
  //  let match = [];
  //  const entities = [];
  //  while ((match = regEx.exec(str)) !== null) {
  //    entities.push(match[0].trim().slice(1));
  //  }
  //  this.setState({mentions: entities});
  //  return entities;
  //};
  //
  //getSuggestions = (value) => {
  //  if (/@/.test(value)) {
  //    const mention = /(@\S+)$/.exec(value);
  //    if (mention === null) {
  //      this.setState({
  //        suggestions: this.props.suggestions,
  //        showSuggestionsList: true
  //      });
  //      return null;
  //    }
  //    const filtered = this.state.suggestions.filter(
  //      suggestion =>
  //        suggestion.toLowerCase().indexOf(mention[1].slice(1).toLowerCase()) === 0 &&
  //        this.state.mentions.indexOf(suggestion) === -1
  //    );
  //    this.setState({
  //      suggestions: filtered,
  //      showSuggestionsList: true
  //    });
  //  } else {
  //    this.setState({
  //      suggestions: this.props.suggestions,
  //      showSuggestionsList: false
  //    });
  //  }
  //};

  chooseMention = event => {
    this.props.updateCurrentCommentText(this.props.value + event.target.value);
    this.setState({ showSuggestionsList: false });
  };

  getMention = value => {
    let mention = null;
    if (/( |^)@\w+$/.test(value)) {
      mention = /(@\w+)$/.exec(value);
      mention = mention === null ? mention : mention[0].slice(1).toLowerCase();
    }
    console.log(mention);
    this.setState({ mention: mention });
    console.log(this.state.mention);
  };

  suggestionsFilter = () => {
    const mention = this.state.mention;
    let filteredSuggestions = this.props.suggestions;
    if (mention !== null) {
      filteredSuggestions = this.props.suggestions.filter(
        suggestion => suggestion.toLowerCase().indexOf(mention) === 0
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
    if (this.state.isShownSuggestionsList) {
      return (
        <ul onMouseDown={this.chooseMention}>
          {this.state.suggestions.map(member => (
            <option key={member}>{member}</option>
          ))}
        </ul>
      );
    }
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
        {this.SuggestionsList()}
      </div>
    );
  }
}

export default Mentions;
