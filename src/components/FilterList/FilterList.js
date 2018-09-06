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
import { connect } from 'react-redux';
import localize from './FilterList.json';

class FilterList extends Component {
  componentWillReceiveProps() {
    ReactTooltip.hide();
  }

  render() {
    const { filters, clearAll, toggleFilterView, fullFilterView, isVisor, lang } = this.props;
    const filterTags = filters.map(filter => {
      if (filter.name === 'changedSprint') {
        return (
          <Tag
            name={filter.label}
            deleteHandler={filter.deleteHandler}
            key={`${filter.name}_${filter.label}`}
            unclickable
            blocked
          />
        );
      }
      return (
        <Tag
          name={filter.label}
          deleteHandler={filter.deleteHandler}
          key={`${filter.name}_${filter.label}`}
          unclickable
        />
      );
    });
    const clearAllButton =
      filterTags.length === 1 && filterTags[0].key === 'Backlog' ? null : (
        <span className={classnames(css.clearAllFilter)} data-tip={localize[lang].CLEAR_FILTERS}>
          <IconBroom onClick={clearAll} />
        </span>
      );

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
                      {clearAllButton}
                    </div>
                  </div>
                ) : (
                  <div className={classnames(css.filterList)}>
                    <span onClick={toggleFilterView} className={css.emptyFiltersLink}>
                      {localize[lang].NOT_SELECTED}
                    </span>
                  </div>
                )}
              </Col>
              {!isVisor && (
                <Col className={classnames(css.filterCol)}>
                  <Button
                    onClick={this.props.openCreateTaskModal}
                    type="primary"
                    text={localize[lang].CREATE_TASK}
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
            data-tip={fullFilterView ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});
export default connect(
  mapStateToProps,
  null
)(FilterList);
