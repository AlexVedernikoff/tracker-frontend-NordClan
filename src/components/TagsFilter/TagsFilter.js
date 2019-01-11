import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';
import localize from './TagsFilter.json';

const isFilterNeeded = tagName => tagName && tagName.length && tagName.length > 1;

class TagsFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    tagName: '',
    filtered: false
  };

  onInputChange = tagName => {
    this.setState({ tagName });
    if (isFilterNeeded(tagName)) {
      this.props
        .getTagsFilter(tagName, this.props.filterFor)
        .then(() => this.setState({ filtered: isFilterNeeded(this.state.tagName) }));
    } else {
      this.setState({ filtered: false });
    }
  };

  options = () => {
    const { allTags, filteredTags } = this.props;
    const optionsSource = this.state.filtered ? filteredTags : allTags;
    return optionsSource.map(tagName => ({ value: tagName, label: tagName }));
  };

  render() {
    const { lang, onClear } = this.props;
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
        canClear
        onClear={onClear}
        value={this.props.filterTags}
        onInputChange={this.onInputChange}
      />
    );
  }
}

TagsFilter.propTypes = {
  allTags: PropTypes.array.isRequired,
  filterFor: PropTypes.oneOf(['project', 'task']).isRequired,
  filterTags: PropTypes.array,
  filteredTags: PropTypes.array.isRequired,
  getTagsFilter: PropTypes.func.isRequired,
  lang: PropTypes.string,
  onClear: PropTypes.func,
  onTagSelect: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let allTags, filteredTags;
  switch (ownProps.filterFor) {
    case 'project':
      allTags = state.Projects.allTags.map(o => o.name);
      filteredTags = state.Projects.tagsFilter;
      break;
    case 'task':
      allTags = state.TaskList.allTags.map(o => o.name);
      filteredTags = state.TaskList.tagsFilter;
      break;
    default:
      allTags = [];
      filteredTags = [];
  }

  return {
    allTags,
    filteredTags,
    lang: state.Localize.lang
  };
};

const mapDispatchToProps = {
  getTagsFilter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsFilter);
