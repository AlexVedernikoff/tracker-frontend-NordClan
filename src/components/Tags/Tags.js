import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import * as css from './Tags.scss';
import Tag from '../Tag';
import onClickOutside from 'react-onclickoutside';
import classnames from 'classnames';
import { createTags } from '../../actions/Tags';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import localize from './Tags.json';
import SelectCreatable from '../SelectCreatable';

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cutTagsShow: false,
      cutTags: this.props.children ? this.props.children.length > (this.props.maxLength || 6) || false : [],
      tags: this.props.children || [],
      visible: false,
      tag: '',
      maxLength: this.props.maxLength || 6
    };
  }

  handleClickOutside = () => {
    this.setState({ visible: false });
  };

  showDropdownMenu = () => {
    this.setState({ visible: !this.state.visible });
  };

  onChangeHandler = e => {
    this.setState({ tag: e.target.value });
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ tags: nextProps.children });
    if (!this.state.cutTagsShow) {
      this.setState({ cutTags: nextProps.children.length > this.state.maxLength });
    }
    this.setState({ cutTagsShow: true });
  };

  sendNewTags = e => {
    e.preventDefault();
    this.setState({ visible: !this.state.visible });
    if (this.state.tag.trim() && !this.props.noRequest) {
      this.props.createTags(this.state.tag.trim(), this.props.taggable, this.props.taggableId);
    } else {
      this.props.createTagsModalTask(this.state.tag.trim());
    }
  };
  render() {
    const { lang } = this.props;
    let sliceTags = this.state.tags;
    if (this.state.tags.length > this.state.maxLength) {
      sliceTags = this.state.tags.slice(0, this.state.maxLength);
    }
    //console.log(this.props);
    //<input
    //  type="text"
    //  placeholder={localize[lang].ADD_TAG}
    //  className={css.tagsInput}
    //  defaultValue=""
    //  autoFocus
    //  onChange={this.onChangeHandler}
    ///>
    //<SelectCreatable
    //type="text"
    //placeholder={localize[lang].ADD_TAG}
    //className={css.tagsInput}
    //defaultValue=""
    //autoFocus
    //onChange={this.onChangeHandler}
    //isMulti
    //onChange={this.handleChange}
    //options={[]}
    ///>
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
                  <Button
                    disabled={!this.state.tag}
                    addedClassNames={{ [css.tagsButton]: true, [css.tagsSubmit]: true }}
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
  maxLength: PropTypes.number,
  noRequest: PropTypes.bool,
  taggable: PropTypes.string,
  taggableId: PropTypes.number,
  tags: PropTypes.array
};

Tags.defaultProps = {
  direction: 'left'
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  createTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(Tags));
