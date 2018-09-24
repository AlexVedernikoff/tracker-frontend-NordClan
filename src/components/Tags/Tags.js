import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import * as css from './Tags.scss';
import Tag from '../Tag';
import onClickOutside from 'react-onclickoutside';
import classnames from 'classnames';
import { createTags } from '../../actions/Tags';
import { getProjectTags } from '../../actions/Project';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import localize from './Tags.json';
import CreatableMulti from '../CreatableMulti';
import layoutAgnosticFilter from '../../utils/layoutAgnosticFilter';

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cutTagsShow: false,
      cutTags: this.props.children ? this.props.children.length > (this.props.maxLength || 6) || false : [],
      tags: this.props.children || [],
      visible: false,
      tag: '',
      maxLength: this.props.maxLength || 6,
      multiValue: []
    };
  }

  componentWillReceiveProps = nextProps => {
    this.setState({ tags: nextProps.children });
    if (!this.state.cutTagsShow) {
      this.setState({ cutTags: nextProps.children.length > this.state.maxLength });
    }
    this.setState({ cutTagsShow: true });
  };

  handleOnChange = value => {
    this.setState({ multiValue: value });
  };

  showDropdownMenu = () => {
    this.props.getProjectTags(this.props.project);
    this.setState({ visible: !this.state.visible });
  };

  handleClickOutside = () => {
    this.setState({ visible: false });
  };

  sendNewTags = e => {
    e.preventDefault();
    this.setState({ visible: !this.state.visible });

    const tagsToSend = this.state.multiValue.map(tag => tag.value.trim());
    if (!this.props.noRequest) {
      this.props.createTags(tagsToSend.join(), this.props.taggable, this.props.taggableId);
    } else {
      this.props.createTagsModalTask(tagsToSend.join());
    }
    this.setState({ multiValue: [] });
  };

  render() {
    const { lang, tagsFromTasks } = this.props;
    const { multiValue } = this.state;
    let sliceTags = this.state.tags;
    const tags = this.state.tags.map(tag => tag.props.name);
    if (this.state.tags.length > this.state.maxLength) {
      sliceTags = this.state.tags.slice(0, this.state.maxLength);
    }
    const options = tagsFromTasks
      ? Object.values(tagsFromTasks).map(tag => ({ value: tag.name, label: tag.name }))
      : [];
    const filtred = options.filter(option => !tags.includes(option.value));
    return (
      <div>
        {!this.state.cutTags ? this.state.tags : sliceTags}
        <span className={css.wrapperAddTags}>
          {this.props.create && this.props.canEdit ? (
            <Tag create data-tip={localize[lang].ADD_TAG} data-place="bottom" onClick={this.showDropdownMenu} />
          ) : null}

          {this.props.canEdit ? (
            <ReactCSSTransitionGroup
              transitionName="animatedElement"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.state.visible ? (
                <form
                  className={classnames({ [css.tagPopup]: true, [css[this.props.direction]]: true })}
                  onSubmit={this.sendNewTags}
                >
                  <CreatableMulti
                    name="tags"
                    noResultsText={localize[lang].NO_RESULTS}
                    options={filtred}
                    placeholder={localize[lang].ADD_TAG}
                    className={classnames(css.tagsInput, css.tagsMultiInput)}
                    autoFocus
                    value={multiValue}
                    onChange={this.handleOnChange}
                    backspaceToRemoveMessage={''}
                    filterOption={layoutAgnosticFilter}
                  />
                  <Button
                    disabled={!this.state.multiValue.length > 0}
                    addedClassNames={{ [css.tagsButton]: true, [css.tagsSubmit]: true, [css.tagsSubmitAbsolute]: true }}
                    icon="IconCheck"
                    htmlType="submit"
                    type="green"
                    onClick={this.sendNewTags}
                  />
                </form>
              ) : null}
            </ReactCSSTransitionGroup>
          ) : null}
        </span>
        {this.state.cutTags ? (
          <a className={css.loadMore} onClick={() => this.setState({ cutTags: false })}>
            {localize[lang].SHOW_ALL} {this.state.tags.length}
          </a>
        ) : null}
      </div>
    );
  }
}

Tags.propTypes = {
  canEdit: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  create: PropTypes.bool,
  createTags: PropTypes.func.isRequired,
  createTagsModalTask: PropTypes.func,
  direction: PropTypes.string,
  getProjectTags: PropTypes.func,
  lang: PropTypes.string,
  maxLength: PropTypes.number,
  noRequest: PropTypes.bool,
  project: PropTypes.number,
  taggable: PropTypes.string,
  taggableId: PropTypes.number,
  tagsFromTasks: PropTypes.object
};

Tags.defaultProps = {
  direction: 'left'
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  project: state.Project.project.id,
  tagsFromTasks: state.Project.tags
});

const mapDispatchToProps = {
  getProjectTags,
  createTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(Tags));
