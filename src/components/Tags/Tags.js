import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from '../SelectDropdown';
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
        this.setState({ visible: !this.state.visible});
    }

    selectValue = (e, name) => {
        this.setState({[name]: e});
    }

    render() {
        return (
            <div>
                {this.props.children}
                <Tag create
                     data-tip="Добавить тег"
                     data-place="bottom"
                     onClick={this.showDropdownMenu}
                />
                <div className={css.tagPopup
                }
                     style={{display: this.state.visible ? 'block' : 'none'}}>
                    
                    <SelectDropdown name="filterTags"
                                    multi
                                    placeholder="Добавить тег..."
                                    backspaceToRemoveMessage="BackSpace для очистки поля"
                                    value={this.state.filterTags}
                                    onChange={(e) => this.selectValue(e, 'filterTags')}
                                    noResultsText="Нет результатов"
                                    options={[
                  {value: 'develop', label: 'develop'},
                  {value: 'frontend', label: 'frontend'},
                  {value: 'backend', label: 'backend'}
                ]}
                    />
                    <Button text="Добавить"
                            type="green"
                    />
                </div>
            </div>
        );
    }


}