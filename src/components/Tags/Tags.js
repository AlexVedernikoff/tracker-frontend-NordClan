import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import * as css from './Tags.scss';
import Tag from '../Tag';
import onClickOutside from 'react-onclickoutside';
import {createTags} from '../../actions/Tags';
import {connect} from 'react-redux';

class Tags extends Component {
  constructor (props) {
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
    this.setState({visible: false});
  };

  showDropdownMenu = () => {
    this.setState({visible: !this.state.visible});
  };

  onChangeHandler = (e) => {
    this.setState({tag: e.target.value});
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({tags: nextProps.children});
    if (!this.state.cutTagsShow) {
      this.setState({cutTags: nextProps.children.length > this.state.maxLength});
    }
    this.setState({cutTagsShow: true});
  };

  sendNewTags = (e) => {
    e.preventDefault();
    this.setState({visible: !this.state.visible});
    this.props.createTags(
      this.state.tag.trim(),
      this.props.taggable,
      this.props.taggableId
    );
  };

  render () {
    let sliceTags = this.state.tags;
    if (this.state.tags.length > this.state.maxLength) {
      sliceTags = this.state.tags.slice(0, this.state.maxLength);
    }
    return (
      <div>
        {!this.state.cutTags
          ? this.state.tags
          : sliceTags}
        {
          this.state.cutTags
            ? <span className={css.loadMore} onClick={() => this.setState({cutTags: false})}>Показать все {this.state.tags.length}</span>
            : null
        }
        <span className={css.wrapperAddTags}>
                    { this.props.create ? <Tag create
                                               data-tip='Добавить тег'
                                               data-place='bottom'
                                               onClick={this.showDropdownMenu}/> : null}
          {this.state.visible ? <form className={css.tagPopup}
                                      onSubmit={this.sendNewTags}>
            <input type='text'
                   placeholder='Добавить тег'
                   className={css.tagsInput}
                   defaultValue=''
                   ref='newTag'
                   onChange={this.onChangeHandler}/>
            <Button addedClassNames={{[css.tagsButton]: true}}
                    text='+'
                    type='green'
                    onClick={this.sendNewTags}
            />
          </form>
            : null
          }
                </span>
      </div>
    );
  }
}

Tags.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array
  ]),
  create: PropTypes.bool,
  createTags: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  taggable: PropTypes.string,
  taggableId: PropTypes.number
};

const mapDispatchToProps = {
  createTags
};

export default connect(null, mapDispatchToProps)(onClickOutside(Tags));
