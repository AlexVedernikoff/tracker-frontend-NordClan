import { oneOfType, string, func } from 'prop-types';
import createClass from 'create-react-class';

let titles: any[] = [];

function getTitle() {
  return titles[titles.length - 1];
}

function updateTitle() {
  document.title = getTitle();
}

export function flushTitle() {
  const title = getTitle();
  titles = [];
  return title;
}

const Title = createClass({
  displayName: 'Title',

  propTypes: {
    render: oneOfType([string, func]).isRequired
  },

  getInitialState() {
    return {
      index: titles.push('') - 1
    };
  },

  componentWillUnmount() {
    titles.pop();
  },

  componentDidMount: updateTitle,

  componentDidUpdate: updateTitle,

  render() {
    const { render } = this.props;
    titles[this.state.index] = typeof render === 'function' ? render(titles[this.state.index - 1] || '') : render;
    return this.props.children || null;
  }
});

export default Title;
