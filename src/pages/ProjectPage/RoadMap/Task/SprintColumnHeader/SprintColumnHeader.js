import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../components/Button';
import SelectDropdown from '../../../../../components/SelectDropdown/';
import classnames from 'classnames';
import * as css from './SprintColumnHeader.scss';
import localize from './SprintColumnHeader.json';
import { connect } from 'react-redux';
import SprintCustomValueComponent from '../../../../../components/SprintSelector/SprintCustomValueComponent';

class SprintColumnHeader extends Component {
  static propTypes = {
    className: PropTypes.string,
    estimates: PropTypes.object.isRequired,
    lang: PropTypes.string,
    name: PropTypes.string.isRequired,
    onCreateTaskClick: PropTypes.func.isRequired,
    onSprintChange: PropTypes.func.isRequired,
    projectSprints: PropTypes.array,
    selectedSprintValue: PropTypes.number,
    sprints: PropTypes.array.isRequired
  };

  render() {
    const {
      lang,
      name,
      className,
      selectedSprintValue,
      onSprintChange,
      sprints,
      onCreateTaskClick,
      estimates,
      projectSprints
    } = this.props;

    return (
      <div className={classnames(css.headerColumnWrapper, className)}>
        <div className={css.headerColumn}>
          <div className={css.selectWrapper}>
            <SelectDropdown
              name={`${name}Column`}
              placeholder={localize[lang].ENTER_SPRINT_NAME}
              multi={false}
              value={selectedSprintValue}
              onChange={onSprintChange}
              noResultsText={localize[lang].NO_RESULTS}
              options={sprints}
              valueComponent={props => (
                <SprintCustomValueComponent
                  {...props}
                  sprintIds={selectedSprintValue}
                  projectSprints={projectSprints}
                />
              )}
            />
          </div>
          <Button
            onClick={onCreateTaskClick}
            type="bordered"
            text={localize[lang].CREATE_TASK}
            icon="IconPlus"
            name={name}
            addedClassNames={{ [css.button]: true }}
            data-tip={localize[lang].CREATE_TASK}
          />
        </div>
        <div className={css.progressBarWrapper} data-tip={estimates.summary}>
          <div
            className={classnames({
              [css.progressBar]: estimates.active,
              [css.exceeded]: estimates.exceeded
            })}
            style={{ width: estimates.width }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectSprints: state.Project.project.sprints
});

export default connect(
  mapStateToProps,
  null
)(SprintColumnHeader);
