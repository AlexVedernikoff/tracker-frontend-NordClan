import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Description.scss';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';
import { stateToHTML } from 'draft-js-export-html';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

class Description extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: this.props.text,
      editing: false
    };
  }

  componentDidMount () {
    window.addEventListener('keydown', this.checkEscapeKeyPress);
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.checkEscapeKeyPress);
  }

  toggleEditing = () => {
    if (this.state.editing) {
      this.updateText();
      this.stopEditing();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  checkEscapeKeyPress = (event) => {
    if (event.keyCode === 27 && this.state.editing) {
      this.stopEditing();
    }
  };

  updateText = () => {
    this.setState({
      text: { __html: stateToHTML(this.TextEditor.state.editorState.getCurrentContent()) }
    });
  };

  render () {
    const { headerType, headerText } = this.props;

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

    return (
      <div className={classnames({[css.desc]: true, [css.edited]: this.state.editing})}>
        {header}
        {this.state.editing
          ? <TextEditor
              ref={ref => (this.TextEditor = ref)}
              content={this.state.text.__html}
            />
          : <div className={css.wiki} dangerouslySetInnerHTML={this.state.text}/>}
        <div className={css.editBorder}>
          {this.state.editing
            ? <IconCheck className={css.save} onClick={this.toggleEditing} data-tip="Сохранить"/>
            : <IconEdit className={css.edit} onClick={this.toggleEditing} data-tip="Редактировать"/>}
        </div>
      </div>
    );
  }
}

Description.propTypes = {
  headerText: PropTypes.string,
  headerType: PropTypes.string,
  text: PropTypes.object
};

export default Description;
