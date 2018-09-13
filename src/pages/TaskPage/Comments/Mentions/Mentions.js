import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as css from './Mentions.scss';
import localize from './Mentions.json';
import { getFullName } from '../../../../utils/NameLocalisation';

class Mentions extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    lang: PropTypes.string,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    resizeKey: PropTypes.string,
    setMentions: PropTypes.func,
    suggestions: PropTypes.array,
    toggleBtn: PropTypes.func,
    updateCurrentCommentText: PropTypes.func,
    value: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      mentions: [],
      isShownSuggestionsList: false
    };
  }

  typeComment = event => {
    this.toggleSuggestionsList(event.target.value);
    this.props.updateCurrentCommentText(event.target.value);
    this.props.toggleBtn(event);
  };

  chooseMention = event => {
    const target = event.target;
    this.props.updateCurrentCommentText(this.props.value.replace(/@(\S+ S*|\S*)$/, `@${target.innerHTML}  `));
    this.setState(
      prevState => prevState.mentions.push({ id: target.id, name: target.innerHTML.toLowerCase() }),
      () => this.props.setMentions(this.state.mentions)
    );
    this.setState({ isShownSuggestionsList: false });
  };

  getMention = () => {
    const value = this.props.value;
    let mention = null;
    if (/( |^)@(\S+ \S*|\S*)$/.test(value)) {
      mention = /@(\S+ \S*|\S*)$/.exec(value);
      mention = mention === null ? mention : mention[0].slice(1).toLowerCase();
    }
    return mention;
  };

  suggestionsFilter = () => {
    const mention = this.getMention();
    let filteredSuggestions = this.props.suggestions;
    if (mention !== null) {
      filteredSuggestions = filteredSuggestions.filter(suggestion => {
        return (
          getFullName(suggestion)
            .toLowerCase()
            .indexOf(mention) === 0 && this.state.mentions.indexOf(mention) === -1
        );
      });
    }
    return filteredSuggestions;
  };

  toggleSuggestionsList = value => {
    this.setState({ isShownSuggestionsList: /( |^)@(\S*|\S+ \S*)$/.test(value) });
  };

  suggestionsList = () => {
    const { lang } = this.props;
    const suggestions = this.suggestionsFilter();
    return (
      <ul>
        {suggestions && suggestions.length ? (
          suggestions.map(suggestion => (
            <li onClick={this.chooseMention} key={suggestion.id} id={suggestion.id}>
              {getFullName(suggestion)}
            </li>
          ))
        ) : (
          <li>{localize[lang].NO_RESULTS}</li>
        )}
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(Mentions);
