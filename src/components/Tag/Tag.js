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
        taggableId,
        ...other
    } = props;

    let deleteTag = (e) => {
        const URL = '/api/tag';

        if (taggable && taggableId && name) {
            axios.delete(URL, {data: {
            taggable: taggable,
            taggableId: taggableId,
            tag: name
        }})
            .then((res) => {
            })
            .catch((err) => {
                console.error(err);
            });
        }
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
