import 'rc-editor-mention/assets/index.css';
import React from 'react';
import Mention, { getMentions } from 'rc-editor-mention';

const originSuggestions = ['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai'];

class MentionEditor extends React.Component {
  state = {
    suggestions: originSuggestions,
    mentions: []
  };
  onSearchChange = value => {
    const searchValue = value.toLowerCase();
    const { mentions } = this.state;
    console.log('>> onSearchChange', value);
    const filtered = originSuggestions.filter(
      suggestion => suggestion.toLowerCase().indexOf(searchValue) !== -1 && mentions.indexOf(`@${suggestion}`) === -1
    );
    this.setState({
      suggestions: filtered
    });
  };
  onSelect = (value, suggestion) => {
    console.log('>> onSelect', value, suggestion);
  };
  onChange = contentState => {
    console.log('>> editorOnChange', contentState);
    const mentions = getMentions(contentState);

    this.setState({
      mentions
    });
  };
  render() {
    const { suggestions } = this.state;
    return (
      <Mention
        style={{ width: 300 }}
        onSearchChange={this.onSearchChange}
        onChange={this.onChange}
        placeholder=" @ 某人 "
        suggestions={suggestions}
        prefix="@"
        onSelect={this.onSelect}
        noRedup
      />
    );
  }
}

export default MentionEditor;
