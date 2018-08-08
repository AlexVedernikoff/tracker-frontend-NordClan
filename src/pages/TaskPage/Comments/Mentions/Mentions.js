export default class Mentions {
  getMentions = str => {
    const regEx = /(@\w+ \w+)|(@\w+)/g;
    let match = [];
    const entities = [];
    while ((match = regEx.exec(str)) !== null) {
      entities.push(match[0].trim().slice(1));
    }
    return entities;
  };

  showSuggestions = value => {
    if (/@/.test(value)) {
      const mention = /((@\w+ \w+)|(@\w+))$/.exec(value);
      const mentions = this.getMentions(value);
      mentions.pop();
      const suggestions = this.props.users.map(user => user.fullNameRu);
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
}
