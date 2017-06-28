import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Creatable} from 'react-select';
import Button from '../Button';
import classnames from 'classnames';
import * as css from './Tags.scss';
import {IconPlus, IconClose} from '../Icons';
import Tag from '../Tag';

export default class Tags extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.array
        ])
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            newTags: []
        };
    }

    showDropdownMenu = (e) => {
        this.setState({visible: !this.state.visible});
    }

    selectValue = (e, name) => {
        this.setState({[name]: e});
    }

    sendNewTags = (e) => {
        console.log(this.state.newTags);
        alert('Я сделяль!');
    }

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
                            <Button className={css.tagsButton}
                                    text="Добавить"
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