import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { UnmountClosed } from 'react-collapse';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { IconArrowDownThin } from '../Icons';
import localize from './CollapsibleRow.json';
import css from './CollapsibleRow.scss';

const CollapsibleRow = props => {
  const { children, lang, isOpened, toggleOpen } = props;
  const contentWillHide = children[0];
  const contentWhenHidden = children[1] || null;
  return (
    <div>
      <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
        {contentWillHide}
      </UnmountClosed>
      <Row className={css.collapseRow}>
        <Col xs={12} sm={12}>
          <ReactCSSTransitionGroup
            transitionEnterTimeout={500}
            transitionLeave={false}
            transitionName="animatedElement"
          >
            {!isOpened && contentWhenHidden}
          </ReactCSSTransitionGroup>
          <div className={css.collapseShowMore}>
            <div
              className={css.collapseShowMoreButton}
              data-tip={isOpened ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
              onClick={toggleOpen}
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
};

(CollapsibleRow as any).propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  closedContent: PropTypes.node,
  isOpened: PropTypes.bool,
  lang: PropTypes.string,
  openedContent: PropTypes.node,
  toggleOpen: PropTypes.func
};

export default CollapsibleRow;
