import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { UnmountClosed } from 'react-collapse';

import * as css from './CollapsibleRow.scss';
import { IconArrowDownThin } from '../Icons';
import localize from './CollapsibleRow.json';

class CollapsibleRow extends React.Component {
  state = {
    isOpened: false
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }));
  };

  render() {
    const { children, lang } = this.props;
    const { isOpened } = this.state;
    const contentWillHide = children[0];
    const contentWhenHidden = children[1] || null;
    return (
      <div>
        <UnmountClosed isOpened={isOpened}>{contentWillHide}</UnmountClosed>
        <Row className={css.collapseRow}>
          <Col xs={12} sm={12}>
            <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionName="filter">
              {!isOpened && contentWhenHidden}
            </ReactCSSTransitionGroup>
            <div className={css.collapseShowMore}>
              <div
                className={css.collapseShowMoreButton}
                data-tip={isOpened ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
                onClick={this.toggleOpen}
              >
                <IconArrowDownThin
                  className={classnames({
                    [css.collapseShowMoreIcon]: true,
                    [css.iconReverse]: isOpened
                  })}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

CollapsibleRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  closedContent: PropTypes.node,
  lang: PropTypes.string,
  openedContent: PropTypes.node
};

export default CollapsibleRow;
