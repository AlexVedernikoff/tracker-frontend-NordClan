import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { history } from '../../History';
import * as css from './Tabs.scss';

export default class Tabs extends React.Component {
  static propTypes = {
    addedClassNames: PropTypes.object,
    children: PropTypes.array,
    currentPath: PropTypes.string,
    routable: PropTypes.bool,
    selected: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  constructor (props) {
    super(props);

    const {routable, currentPath} = this.props;

    this.currentPath = routable && currentPath;
    this.state = { selected: this.getSelectedIndex() };
  }

  componentWillMount () {
    const [firstChild] = this.props.children;

    if (!this.state.selected) {
      history.replace(this.setRoute(firstChild.props.path));
    }
  }

  getSelectedIndex () {
    const {children, selected} = this.props;
    let selectedIndex;

    if (this.currentPath) {
      selectedIndex = children.findIndex(child => child.props.path.slice(1) === selected);
    } else {
      selectedIndex = parseInt(selected);
    }

    return children[selectedIndex] ? selectedIndex : 0;
  }

  setRoute (subpath) {
    return this.currentPath && subpath ? this.currentPath + subpath : '';
  }

  renderTitles () {
    function labels (child, idx) {
      const activeClass = this.state.selected === idx ? css.isActive : '';
      const {label, path} = child.props;

      return (
        <li role="tab" key={idx} aria-controls={`panel${idx}`}>
          <Link className={activeClass} onClick={this.onClick.bind(this, idx)} to={this.setRoute(path)}>
            {label}
          </Link>
        </li>
      );
    }

    return (
      <ul className={css.tabs__labels} role="tablist">
        {this.props.children.map(labels.bind(this))}
      </ul>
    );
  }

  onClick (index, event) {
    if (!this.currentPath) {
      event.preventDefault();
    }

    this.setState({
      selected: index
    });
  }

  render () {
    return (
      <div className={classnames({
        [css.tabs]: !!css.tabs,
        ...this.props.addedClassNames
      })}>
        {this.renderTitles()}

        <div className={css.tabs__content}>{this.props.children[this.state.selected]}</div>
      </div>
    );
  }
}
