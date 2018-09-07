import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as css from './Mentions.scss';
import localize from './Mentions.json';

class Mentions extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    getMentions: PropTypes.func,
    lang: PropTypes.string,
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
    this.props.updateCurrentCommentText(this.props.value.replace(/(@\S*)$/, `@${target.innerHTML} `));
    this.setState(
      prevState => prevState.mentions.push({ id: target.id, name: target.innerHTML.toLowerCase() }),
      function() {
        this.props.getMentions(this.state.mentions);
      }
    );
    this.setState({ isShownSuggestionsList: false });
  };

  getMention = value => {
    let mention = null;
    if (/( |^)@\S*$/.test(value)) {
      mention = /(@\S+)$/.exec(value);
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
    const { lang } = this.props;
    if (value.toLowerCase().indexOf('@all') !== -1) {
      this.setState({ suggestions: [] });
    } else {
      this.state.mentions.map(ment => {
        if (value.toLowerCase().indexOf(`@${ment.name}`) !== -1) {
          filteredSuggestions = filteredSuggestions.filter(suggestion => {
            if (lang === 'ru') {
              return suggestion.fullNameRu.toLowerCase() !== ment.name.toLowerCase();
            }
            return suggestion.fullNameEn.toLowerCase() !== ment.name.toLowerCase();
          });
        } else {
          mentions = mentions.filter(el => el.name !== ment.name);
        }
      });
      this.setState({ mentions }, function() {
        this.props.getMentions(this.state.mentions);
      });
      if (mention !== null) {
        filteredSuggestions = filteredSuggestions.filter(suggestion => {
          if (lang === 'ru') {
            return (
              suggestion.fullNameRu.toLowerCase().indexOf(mention) === 0 && this.state.mentions.indexOf(mention) === -1
            );
          }
          return (
            suggestion.fullNameEn.toLowerCase().indexOf(mention) === 0 && this.state.mentions.indexOf(mention) === -1
          );
        });
      }
      this.setState({ suggestions: filteredSuggestions });
    }
  };

  toggleSuggestionsList = value => {
    if (/( |^)@\S*$/.test(value)) {
      this.setState({ isShownSuggestionsList: true });
    } else {
      this.setState({ isShownSuggestionsList: false });
    }
  };

  suggestionsList = () => {
    const { lang } = this.props;
    const suggestions = this.state.suggestions;
    suggestions = suggestions.length > 5 ? (suggestions.length = 5) : null;
    return (
      <ul>
        {suggestions && suggestions.length ? (
          suggestions.map(suggestion => (
            <li onClick={this.chooseMention} key={suggestion.id} id={suggestion.id}>
              {lang === 'en' ? suggestion.fullNameEn : suggestion.fullNameRu}
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
