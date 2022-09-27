import React, { Component } from 'react';
import css from './ScrollTop.scss';
import { IconArrowUp } from '../Icons';

class ScrollTop extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { showButton: false };
  }

  componentDidMount() {
    // TODO this.parentEl = ReactDOM.findDOMNode(this._reactInternalInstance._currentElement._owner._instance).parentNode;

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
      (window as any).attachEvent('onmousewheel', this.onWheel, { passive: true });
    }
  }

  componentWillUnmount() {
    if ((window as any).addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        (window as any).removeEventListener('wheel', this.onWheel, { passive: true });
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        (window as any).removeEventListener('mousewheel', this.onWheel, { passive: true });
      } else {
        // Firefox < 17
        (window as any).removeEventListener('MozMousePixelScroll', this.onWheel, { passive: true });
      }
    } else {
      // IE8-
      (window as any).removeEventListener('onmousewheel', this.onWheel, { passive: true });
    }
  }

  onWheel = () => {
    this.setState({
      showButton: this.getParentYOffset() > 150 ? true : false
    });
  };

  getParentYOffset = () => 0;
  // TODO Math.abs(this.parentEl.getBoundingClientRect().top);

  scrollTop = () => {
    // TODO
    // this.parentEl.scrollIntoView();
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
