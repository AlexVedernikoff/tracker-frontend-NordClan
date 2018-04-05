import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import ReactTooltip from 'react-tooltip';
import Tag from '../Tag';
import Button from '../../components/Button';
import classnames from 'classnames';
import { IconClose, IconArrowDownThin, IconBroom } from '../Icons';
import * as css from './FilterList.scss';
import { UnmountClosed, Collapse } from 'react-collapse';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class FilterList extends Component {
  componentWillReceiveProps() {
    ReactTooltip.hide();
  }

  render() {
    const { filters, clearAll, toggleFilterView, fullFilterView, isVisor } = this.props;
    const filterTags = filters.map(filter => {
      return <Tag name={filter.label} deleteHandler={filter.deleteHandler} key={filter.name} unclickable />;
    });

    return (
      <div>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeave={false}>
          {!fullFilterView && (
            <Row className={css.filtersRow}>
              <Col xs>
                {filterTags.length ? (
                  <div className={classnames(css.filterList)}>
                    <div>
                      {filterTags}
                      <span className={classnames(css.clearAllFilter)} data-tip="Очистить фильтры">
                        <IconBroom onClick={clearAll} />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={classnames(css.filterList)}>Фильтры не выбраны</div>
                )}
              </Col>
              {!isVisor && (
                <Col className={classnames(css.filterCol)}>
                  <Button
                    onClick={this.props.openCreateTaskModal}
                    type="primary"
                    text="Создать задачу"
                    icon="IconPlus"
                    name="right"
                  />
                </Col>
              )}
            </Row>
          )}
        </ReactCSSTransitionGroup>
        <div className={classnames(css.filterListShowMore)}>
          <div
            className={classnames(css.filterListShowMoreButton)}
            data-tip={fullFilterView ? 'Скрыть фильтры' : 'Показать фильтры'}
            onClick={toggleFilterView}
          >
            <IconArrowDownThin
              className={classnames({ [css.filterListShowMoreIcon]: true, [css.iconReverse]: fullFilterView })}
            />
          </div>
        </div>
      </div>
    );
  }
}

FilterList.propTypes = {
  clearAll: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  fullFilterView: PropTypes.bool.isRequired,
  isVisor: PropTypes.bool.isRequired,
  openCreateTaskModal: PropTypes.func.isRequired,
  toggleFilterView: PropTypes.func.isRequired
};
