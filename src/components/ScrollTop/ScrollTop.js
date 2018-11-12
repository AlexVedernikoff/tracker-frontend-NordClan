import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as css from './ScrollTop.scss';
import { IconArrowUp } from '../Icons';

class ScrollTop extends Component {
  constructor(props) {
    super(props);
    this.state = { showButton: false };
  }

  onWheel = () => {
    this.setState({
      showButton: this.getParentYOffset() > 150 ? true : false
    });
  };

  componentDidMount() {
    this.parentEl = ReactDOM.findDOMNode(this._reactInternalInstance._currentElement._owner._instance).parentNode;

    if (window.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        window.addEventListener('wheel', this.onWheel, { passive: true });
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        window.addEventListener('mousewheel', this.onWheel, { passive: true });
      } else {
        // Firefox < 17
        window.addEventListener('MozMousePixelScroll', this.onWheel, { passive: true });
      }
    } else {
      // IE8-
      window.attachEvent('onmousewheel', this.onWheel, { passive: true });
    }
  }

  componentWillUnmount() {
    if (window.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        window.removeEventListener('wheel', this.onWheel, { passive: true });
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        window.removeEventListener('mousewheel', this.onWheel, { passive: true });
      } else {
        // Firefox < 17
        window.removeEventListener('MozMousePixelScroll', this.onWheel, { passive: true });
      }
    } else {
      // IE8-
      window.removeEventListener('onmousewheel', this.onWheel, { passive: true });
    }
  }

  getParentYOffset = () => Math.abs(this.parentEl.getBoundingClientRect().top);

  scrollTop = () => {
    this.parentEl.scrollIntoView();
    this.setState({ showButton: false });
  };

  render() {
    return this.state.showButton ? (
      <div>
        <div onClick={this.scrollTop} className={css.ScrollTop}>
          <IconArrowUp />
        </div>
      </div>
    ) : null;
  }
}

export default ScrollTop;
