import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tabs.scss';

export default class Tabs extends React.Component {
  constructor (props) {
    super(props);

    const {routable, currentPath} = this.props;

    this.currentPath = routable && currentPath;
    this.state = { selected: this._setSelectedIndex() };
  }

  _setSelectedIndex () {
    const {children, selected} = this.props;
    let selectedIndex;

    if (this.currentPath) {
      selectedIndex = children.findIndex(child => child.props.path.slice(1) == selected);
    } else {
      selectedIndex = parseInt(selected)
    }

    return (isNaN(selectedIndex) || !children[selectedIndex]) ? 0 : selectedIndex;
  }

  _setRoute (subpath) {
    return this.currentPath && subpath? this.currentPath + subpath: '';
  }

  _renderTitles () {
    function labels (child, idx) {
      const activeClass = this.state.selected === idx ? css.isActive : '';
      const {label, path} = child.props;

      return (
        <li role="tab" key={idx} aria-controls={`panel${idx}`}>
          <Link className={activeClass} onClick={this.onClick.bind(this, idx)} to={this._setRoute(path)}>
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
        {this._renderTitles()}

        <div className={css.tabs__content}>{this.props.children[this.state.selected]}</div>
      </div>
    );
  }
}
