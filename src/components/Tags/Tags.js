import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Creatable} from 'react-select';
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
            visible: false,
            newTags: []
        };
    };

    handleClickOutside = evt => {
        this.setState({visible: false});
    };

    showDropdownMenu = (e) => {
        console.log(this.props.taggable);
        //console.log(project.id);
        this.setState({visible: !this.state.visible});
    };

    selectValue = (e, name) => {
        this.setState({[name]: e});
    };

    sendNewTags = (e) => {
        const URL = '/api/tag';
        let tags = '';
        let taggable = this.props.taggable;

        this.state.newTags.forEach(function (tag) {
            if (tag.value) {
                tags += tag.value.trim() + ',';
            }
        });

        if (this.state.newTags.length) {
            tags = tags.substring(0, tags.length - 1);
            tags.trim();
        }

        if (tags && taggable) {
            axios.post(URL, {
                    taggable: taggable,
                    taggableId: 1,
                    tag: tags
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    render() {
        return (
            <div>
                {this.props.children}
                <span className={css.wrapperAddTags}>
                    <Tag create
                         data-tip="Добавить тег"
                         data-place="bottom"
                         onClick={this.showDropdownMenu}
                    />
                    {this.state.visible ?
                        <div className={css.tagPopup}>
                            <Creatable className={css.tagsInput}
                                       name="newTags"
                                       multi
                                       placeholder="Добавить тег..."
                                       backspaceToRemoveMessage="BackSpace для очистки поля"
                                       value={this.state.newTags}
                                       onChange={(e) => this.selectValue(e, 'newTags')}
                                       noResultsText="Нет результатов"
                                       options={[
                                              {value: 'develop', label: 'develop'},
                                              {value: 'frontend', label: 'frontend'},
                                              {value: 'backend', label: 'backend'}
                                            ]}
                            />
                            <Button addedClassNames={{[css.tagsButton]: true}}
                                    text="+"
                                    type="green"
                                    onClick={this.sendNewTags}
                            />
                        </div>
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