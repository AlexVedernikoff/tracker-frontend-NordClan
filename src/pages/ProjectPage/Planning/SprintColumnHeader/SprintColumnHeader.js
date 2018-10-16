import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import SelectDropdown from '../../../../components/SelectDropdown/';
import classnames from 'classnames';
import * as css from './SprintColumnHeader.scss';
import localize from './SprintColumnHeader.json';
import { connect } from 'react-redux';

class SprintColumnHeader extends Component {
  static propTypes = {
    className: PropTypes.string,
    estimates: PropTypes.object.isRequired,
    lang: PropTypes.string,
    name: PropTypes.string.isRequired,
    onCreateTaskClick: PropTypes.func.isRequired,
    onSprintChange: PropTypes.func.isRequired,
    selectedSprintValue: PropTypes.number,
    sprints: PropTypes.array.isRequired
  };

  render() {
    const { lang } = this.props;

    return (
      <div className={classnames(css.headerColumnWrapper, this.props.className)}>
        <div className={css.headerColumn}>
          <div className={css.selectWrapper}>
            <SelectDropdown
              name={`${this.props.name}Column`}
              placeholder={localize[lang].ENTER_SPRINT_NAME}
              multi={false}
              value={this.props.selectedSprintValue}
              onChange={this.props.onSprintChange}
              noResultsText={localize[lang].NO_RESULTS}
              options={this.props.sprints}
            />
          </div>
          <Button
            onClick={this.props.onCreateTaskClick}
            type="bordered"
            text={localize[lang].CREATE_TASK}
            icon="IconPlus"
            name={this.props.name}
            addedClassNames={{ [css.button]: true }}
            data-tip={localize[lang].CREATE_TASK}
          />
        </div>
        <div className={css.progressBarWrapper} data-tip={this.props.estimates.summary}>
          <div
            className={classnames({
              [css.progressBar]: this.props.estimates.active,
              [css.exceeded]: this.props.estimates.exceeded
            })}
            style={{ width: this.props.estimates.width }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(SprintColumnHeader);
