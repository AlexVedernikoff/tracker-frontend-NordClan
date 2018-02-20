import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tabs.scss';
export default class Tabs extends React.Component {
  constructor (props) {
    super(props);

    this.state = { selected: this.props.selected };
  }

  _renderTitles () {
    function labels (child, idx) {
      const activeClass = this.state.selected === idx ? css.isActive : '';
      return (
        <li role="tab" key={idx} aria-controls={`panel${idx}`}>
          <a className={activeClass} onClick={this.onClick.bind(this, idx)} href="#">
            {child.props.label}
          </a>
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
    event.preventDefault();
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
