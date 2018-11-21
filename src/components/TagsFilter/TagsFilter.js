import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';
import localize from './TagsFilter.json';

class TagsFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  onInputChange = tagName => {
    if (tagName && tagName.length && tagName.length > 1) {
      this.props.getTagsFilter(tagName, this.props.filterFor);
    }
  };

  options = () => {
    switch (this.props.filterFor) {
      case 'project':
        return this.props.projectsTagsOptions.map(el => ({ value: el, label: el }));
      case 'task':
        return this.props.tasksTagsOptions.map(el => ({ value: el, label: el }));
      default:
        return [];
    }
  };

  render() {
    const { lang } = this.props;
    return (
      <SelectDropdown
        searchPromptText={localize[lang].TAG_NAME}
        placeholder={localize[lang].TAG_NAME}
        backspaceToRemoveMessage={''}
        noResultsText={localize[lang].NOT_FOUND}
        multi
        ignoreCase
        options={this.options()}
        filterOption={el => el}
        onChange={this.props.onTagSelect}
        value={this.props.filterTags}
        onInputChange={this.onInputChange}
      />
    );
  }
}

TagsFilter.propTypes = {
  filterFor: PropTypes.oneOf(['project', 'task']).isRequired,
  filterTags: PropTypes.array,
  getTagsFilter: PropTypes.func.isRequired,
  lang: PropTypes.string,
  onTagSelect: PropTypes.func.isRequired,
  projectsTagsOptions: PropTypes.array.isRequired,
  tasksTagsOptions: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  projectsTagsOptions: state.Projects.tagsFilter,
  tasksTagsOptions: state.TaskList.tagsFilter,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getTagsFilter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsFilter);
