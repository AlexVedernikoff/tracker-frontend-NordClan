import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UnmountClosed } from 'react-collapse';

import * as css from './CollapsibleRow.scss';
import { IconArrowDownThin } from '../Icons';
import localize from './CollapsibleRow.json';

const CollapsibleRow = props => {
  const { children, lang, isOpened, toggleOpen } = props;
  const contentWillHide = children[0];
  const contentWhenHidden = children[1] || null;
  return (
    <div>
      <UnmountClosed isOpened={isOpened}>{contentWillHide}</UnmountClosed>
      <Row className={css.collapseRow}>
        <Col xs={12} sm={12}>
          {!isOpened && contentWhenHidden}
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

CollapsibleRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  closedContent: PropTypes.node,
  isOpened: PropTypes.bool,
  lang: PropTypes.string,
  openedContent: PropTypes.node,
  toggleOpen: PropTypes.func
};

export default CollapsibleRow;
