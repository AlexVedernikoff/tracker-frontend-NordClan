import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import classnames from 'classnames';
import * as css from './Tags.scss';
import {IconPlus, IconClose} from '../Icons';
import Tag from '../Tag';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: this.props.children,
            visible: false,
            tag: ''
        };
    };

    handleClickOutside = evt => {
        this.setState({visible: false});
    };

    showDropdownMenu = (e) => {
        this.setState({visible: !this.state.visible});
    };

    onChangeHandler = (e) => {
        this.setState({tag: e.target.value})
    };

    sendNewTags = (e) => {
        e.preventDefault();
        this.setState({visible: !this.state.visible});

        const URL = '/api/tag';
        const self = this;
        let tags = this.state.tag;
        let prevTags = this.state.tags;
        let taggable = this.props.taggable || 'task';

        tags = tags.trim();

        if (tags && taggable) {
            axios.post(URL, {
                    taggable: taggable,
                    taggableId: 1,
                    tag: tags
                })
                .then((res) => {
                    // prevTags = prevTags.map(function (t) {
                    //     return t;
                    // });
                    // prevTags.push((<Tag name={tags}/>));
                    // self.setState({tags: prevTags});
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    render() {
        return (
            <div>
                {this.state.tags}
                <span className={css.wrapperAddTags}>
                    <Tag create
                         data-tip="Добавить тег"
                         data-place="bottom"
                         onClick={this.showDropdownMenu}
                    />
                    {this.state.visible ?
                        <form className={css.tagPopup}
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
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.array
    ])
};

export default onClickOutside(Tags);