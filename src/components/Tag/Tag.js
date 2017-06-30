import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import {IconPlus, IconClose} from '../Icons';
import axios from 'axios';

const Tag = (props) => {
    const {
        name,
        create,
        blocked,
        taggable,
        ...other
    } = props;

    let deleteTag = (e) => {
        console.log(taggable);
        console.log(name);

        const URL = '/api/tag';
        axios.delete(URL, {
            taggable: taggable,
            taggableId: 1,
            tag: name
        })
            .then((res) => {
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <span {...other} className={classnames({[css.tag]: true, [css.create]: create})}>
      <span className={classnames({[css.tagPart]: true, [css.tagCreate]: create})}>{create ? <IconPlus/> : name}</span>
            {
                create ? null : <span className={classnames(css.tagPart, css.tagClose)}>
          { blocked ? null : <IconClose onClick={deleteTag}/> }
        </span>
            }
    </span>
    );
};

Tag.propTypes = {
    blocked: PropTypes.bool,
    create: PropTypes.bool,
    name: PropTypes.string
};

export default Tag;
