import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import * as css from './Tags.scss';
import Tag from '../Tag';
import onClickOutside from 'react-onclickoutside';
import {CreateTags} from '../../actions/Tags';
import {connect} from 'react-redux';

class Tags extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tags: this.props.children,
      visible: false,
      tag: ''
    };
  }

  handleClickOutside = evt => {
    this.setState({visible: false});
  };

  showDropdownMenu = (e) => {
    this.setState({visible: !this.state.visible});
  };

  onChangeHandler = (e) => {
    this.setState({tag: e.target.value});
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({tags: nextProps.children});
  };

  sendNewTags = (e) => {
    e.preventDefault();
    this.setState({visible: !this.state.visible});
    this.props.CreateTags(
      this.state.tag.trim(),
      this.props.taggable,
      this.props.taggableId
    );
  };

  render () {
    return (
      <div>
        {this.state.tags}
        <span className={css.wrapperAddTags}>
                    { this.props.create ? <Tag create
                                               data-tip="Добавить тег"
                                               data-place="bottom"
                                               onClick={this.showDropdownMenu}/> : null}
          {this.state.visible ? <form className={css.tagPopup}
                                      onSubmit={this.sendNewTags}>
            <input type="text"
                   placeholder="Добавить тег"
                   className={css.tagsInput}
                   defaultValue=''
                   onChange={this.onChangeHandler}
                   ref='tagInput'/>
            <Button addedClassNames={{[css.tagsButton]: true}}
                    text="+"
                    type="green"
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
  CreateTags: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array
  ]),
  create: PropTypes.bool,
  taggable: PropTypes.string,
  taggableId: PropTypes.number
};

const mapDispatchToProps = {
  CreateTags
};

export default connect(null, mapDispatchToProps)(onClickOutside(Tags));
