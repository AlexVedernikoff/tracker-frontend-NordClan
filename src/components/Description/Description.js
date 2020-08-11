import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Description.scss';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';
import { stateToHTML } from 'draft-js-export-html';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

import Autolinker from 'autolinker';
import localize from './Description.json';
import { connect } from 'react-redux';

class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.checkEscapeKeyPress);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({
        text: nextProps.text
      });
    }
    if (this.props.isEditing !== nextProps.isEditing) {
      ReactTooltip.hide();
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkEscapeKeyPress);
  }

  toggleEditing = () => {
    if (this.props.isEditing) {
      this.updateText();
    } else {
      this.startEditing();
    }
  };

  toggleEditingByClick = event => {
    if (this.props.clickAnywhereToEdit === true && !this.props.isEditing) {
      event.stopPropagation();
      event.preventDefault();
  onBlur = () => {
    if (this.props.clickAnywhereToEdit === true && this.props.isEditing) {
      this.toggleEditing();
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
    const options = {
      inlineStyles: {
        SUPERSCRIPT: { element: 'sup' },
        SUBSCRIPT: { element: 'sub' }
      }
    };
    const description = stateToHTML(this.TextEditor.state.editorState.getCurrentContent(), options);
    onEditSubmit(
      {
        id: this.props.id,
        description: description,
        trimmed: this.isEmpty(description) ? '' : description
      },
      'Description'
    );
  };

  // Link eval - making links clickable
  parseTextLinks = description => {
    return description.__html ? Autolinker.link(description.__html) : '';
  };

  isEmpty = parsed => {
    return (
      parsed
        .replace(/<[/]*(p|br)>/g, '')
        .replace(/&nbsp;/g, '')
        .trim().length === 0
    );
  };

  render() {
    const { headerType, headerText, lang, placeholder } = this.props;

    let header = null;

    switch (headerType) {
      case 'h1':
        header = <h1>{headerText}</h1>;
        break;

      case 'h2':
        header = <h2>{headerText}</h2>;
        break;

      case 'h3':
        header = <h3>{headerText}</h3>;
        break;

      case 'h4':
        header = <h4>{headerText}</h4>;
        break;

      case 'h5':
        header = <h5>{headerText}</h5>;
        break;

      default:
        header = null;
    }

    let parsed = this.parseTextLinks(this.props.text).replace(/&nbsp;/g, '');
    const isEmpty = this.isEmpty(parsed);
    const className = isEmpty ? css.wiki + ' ' + css.placeholder : css.wiki;
    parsed = isEmpty ? placeholder : parsed;

    return (
      <div
        onClick={this.toggleEditingByClick}
        style={(this.props.clickAnywhereToEdit && !this.props.isEditing && { cursor: 'pointer' }) || {}}
        className={classnames({
          [css.desc]: true,
          [css.edited]: this.props.DescriptionIsEditing
        })}
      >
        {header}
        {this.props.isEditing ? (
          <TextEditor ref={ref => (this.TextEditor = ref)} content={this.props.text.__html || ''} />
            onBlur={this.onBlur}
          />
        ) : (
          <div className={className} dangerouslySetInnerHTML={{ __html: parsed }} />
        )}
        {this.props.canEdit ? (
          <div className={css.editBorder}>
            {this.props.isEditing ? (
              <IconCheck
                className={css.save}
                onClick={this.toggleEditing}
                id={this.props.id + 1}
                data-tip={localize[lang].SAVE}
              />
            ) : (
              <IconEdit
                className={css.edit}
                onClick={this.toggleEditing}
                id={this.props.id + 1}
                data-tip={localize[lang].EDIT}
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

Description.propTypes = {
  DescriptionIsEditing: PropTypes.bool,
  canEdit: PropTypes.bool,
  clickAnywhereToEdit: PropTypes.bool,
  headerText: PropTypes.string,
  headerType: PropTypes.string,
  id: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  lang: PropTypes.string,
  onEditFinish: PropTypes.func.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  text: PropTypes.object
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(Description);
