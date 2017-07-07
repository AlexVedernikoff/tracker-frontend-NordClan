import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Description.scss';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';
import { stateToHTML } from 'draft-js-export-html';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  ChangeProject,
  StartEditing,
  StopEditing
} from '../../actions/Project';

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
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.checkEscapeKeyPress);
  }

  toggleEditing = () => {
    if (this.props.DescriptionIsEditing) {
      this.updateText();
      this.stopEditing();
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
    this.setState(
      {
        text: {
          __html: stateToHTML(
            this.TextEditor.state.editorState.getCurrentContent()
          )
        }
      },
      () => {
        onEditSubmit(
          {
            id: this.props.id,
            description: this.state.text.__html
          },
          'Description'
        );
      }
    );
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
        {this.props.DescriptionIsEditing
          ? <TextEditor
              ref={ref => (this.TextEditor = ref)}
              content={this.state.text.__html}
            />
          : <div
              className={css.wiki}
              dangerouslySetInnerHTML={this.state.text}
            />}
        <div className={css.editBorder}>
          {this.props.DescriptionIsEditing
            ? <IconCheck
                className={css.save}
                onClick={this.toggleEditing}
                data-tip="Сохранить"
              />
            : <IconEdit
                className={css.edit}
                onClick={this.toggleEditing}
                data-tip="Редактировать"
              />}
        </div>
      </div>
    );
  }
}

Description.propTypes = {
  headerText: PropTypes.string,
  headerType: PropTypes.string,
  text: PropTypes.object,
  DescriptionIsEditing: PropTypes.bool.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  onEditFinish: PropTypes.func.isRequired,
  onEditStart: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  DescriptionIsEditing: state.Project.DescriptionIsEditing
});

export default connect(mapStateToProps)(Description);
