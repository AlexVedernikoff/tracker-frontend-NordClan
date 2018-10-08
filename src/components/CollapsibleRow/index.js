import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from './CollapsibleRow.scss';
import { IconArrowDownThin } from '../Icons';
import { UnmountClosed } from 'react-collapse';
import Pt from 'prop-types';

class CollapsibleRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false
    };
  }

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }));
  };

  render() {
    const { openedContent, closedContent } = this.props;
    return (
      <div>
        <UnmountClosed isOpened={this.state.isOpened}>{openedContent}</UnmountClosed>
        <Row className={css.collapseRow}>
          <Col xs={12} sm={12}>
            <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionName="filter">
              {!this.state.isOpened && closedContent}
            </ReactCSSTransitionGroup>

            <div className={css.collapseShowMore}>
              <div
                className={css.collapseShowMoreButton}
                // data-tip={this.state.isOpened ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
                onClick={this.toggleOpen}
              >
                <IconArrowDownThin
                  className={classnames({
                    [css.collapseShowMoreIcon]: true,
                    [css.iconReverse]: this.state.isOpened
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
  closedContent: Pt.node,
  openedContent: Pt.node
};

export default CollapsibleRow;
