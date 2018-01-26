import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Description.scss';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';
import { stateToHTML } from 'draft-js-export-html';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

import Autolinker from 'autolinker';

class Description extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }

  componentDidMount () {
    window.addEventListener('keydown', this.checkEscapeKeyPress);
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({
        text: nextProps.text
      });
    }
    if (this.props.isEditing !== nextProps.isEditing) {
      ReactTooltip.hide();
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.checkEscapeKeyPress);
  }

  toggleEditing = () => {
    if (this.props.isEditing) {
      this.updateText();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    const { onEditStart } = this.props;
    onEditStart('Description');
  };

  stopEditing = () => {
    const { onEditFinish } = this.props;
    onEditFinish('Description');
  };

  checkEscapeKeyPress = event => {
    if (event.keyCode === 27 && this.props.DescriptionIsEditing) {
      this.stopEditing();
    }
  };

  updateText = () => {
    const { onEditSubmit } = this.props;

    onEditSubmit(
      {
        id: this.props.id,
        description: stateToHTML(
          this.TextEditor.state.editorState.getCurrentContent()
        )
      },
      'Description'
    );
  };

  // Link eval - making links clickable
  parseTextLinks = (description) => {
    return (description.__html) ? Autolinker.link(description.__html) : '';
  };

  render () {
    const { headerType, headerText } = this.props;

    let header = null;

    switch (headerType) {
    case 'h1':
      header = (
        <h1>
          {headerText}
        </h1>
      );
      break;

    case 'h2':
      header = (
        <h2>
          {headerText}
        </h2>
      );
      break;

    case 'h3':
      header = (
        <h3>
          {headerText}
        </h3>
      );
      break;

    case 'h4':
      header = (
        <h4>
          {headerText}
        </h4>
      );
      break;

    case 'h5':
      header = (
        <h5>
          {headerText}
        </h5>
      );
      break;

    default:
      header = null;
    }

    return (
      <div
        className={classnames({
          [css.desc]: true,
          [css.edited]: this.props.DescriptionIsEditing
        })}
      >
        {header}
        {
          this.props.isEditing
            ? <TextEditor
              ref={ref => (this.TextEditor = ref)}
              content={this.props.text.__html || ''}
            />
            : <div
              className={css.wiki}
              dangerouslySetInnerHTML={{__html: this.parseTextLinks(this.props.text)}}
            />
        }
        {
          this.props.canEdit
            ? <div className={css.editBorder}>
              {
                this.props.isEditing
                  ? <IconCheck
                    className={css.save}
                    onClick={this.toggleEditing}
                    data-tip="Сохранить"
                  />
                  : <IconEdit
                    className={css.edit}
                    onClick={this.toggleEditing}
                    data-tip="Редактировать"
                  />
              }
            </div>
            : null
        }
      </div>
    );
  }
}

Description.propTypes = {
  DescriptionIsEditing: PropTypes.bool,
  canEdit: PropTypes.bool,
  headerText: PropTypes.string,
  headerType: PropTypes.string,
  id: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  onEditFinish: PropTypes.func.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  text: PropTypes.object
};

export default Description;
