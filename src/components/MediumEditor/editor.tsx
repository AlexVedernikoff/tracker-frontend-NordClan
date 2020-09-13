import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

let _MediumEditor;

if (typeof document !== 'undefined') {
  _MediumEditor = require('medium-editor');
}

const isFilePaste = function (event) {
  return event &&
    event.clipboardData &&
    event.clipboardData.items &&
    event.clipboardData.types.indexOf('Files') > -1;
};

const handleFilePaste = function (event) {
  // ...
  // All your logic for handling your special paste
  console.log({ handleFilePaste: event });
};

const _CustomPasteHandler = _MediumEditor.extensions.paste.extend({
  forcePlainText: false,
  cleanPastedHTML: true,
  cleanAttrs: ['class', 'style', 'dir'],
  cleanTags: ['meta', 'img'],
  init: function () {
    _MediumEditor.Extension.prototype.init.apply(this, arguments);
    if (this.forcePlainText || this.cleanPastedHTML) {
      this.subscribe('editableKeydown', this.handleKeydown.bind(this));
      this.getEditorElements().forEach(function (element) {
        this.on(element, 'paste', this.handlePaste.bind(this));
      }, this);
    }
  },
  handlePaste: function (event) {
    console.log({ handlePaste: event });
    if (isFilePaste(event)) {
      this.removePasteBin();
      //handleImagePaste($(this.document.activeElement).attr("tm_id"), event);
      handleFilePaste(event);
      return;
    }
    console.log({ handlePaste: true });
    _MediumEditor.extensions.paste.prototype.handlePaste.apply(this, arguments);
    //ProcessPastedImages($(this.document.activeElement).attr("tm_id"));
  },
  handlePasteBinPaste: function (event) {
    if (isFilePaste(event)) {
      this.removePasteBin();
      handleFilePaste(event);
      //handleImagePaste($(this.document.activeElement).attr("tm_id"), event);
      return;
    }
    //_MediumEditor.extensions.paste.prototype.handlePasteBinPaste.apply(this, arguments);
    //ProcessPastedImages($(this.document.activeElement).attr("tm_id"));
  }
});

const CustomPasteHandler = _MediumEditor.extensions.paste.extend({
  handlePaste: function (event) {
    if (isFilePaste(event)) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    _MediumEditor.extensions.paste.prototype.handlePaste.apply(this, arguments);
  },
  handlePasteBinPaste: function (event) {
    if (isFilePaste(event)) {
      this.base.options.pasteCallback(event);
      return;
    }
    _MediumEditor.extensions.paste.prototype.handlePasteBinPaste.apply(this, arguments);
  }
});

export default class MediumEditor extends Component {
  static propTypes = {
    flushEditorDOM: PropTypes.bool,
    onChange: PropTypes.func,
    onPaste: PropTypes.func,
    options: PropTypes.any,
    placeholder: PropTypes.string,
    tag: PropTypes.string,
    text: PropTypes.string
  };

  static defaultProps = {
    tag: 'div',
    text: '',
    onPaste: () => { },
    onChange: () => { }
  };

  componentDidMount = () => {
    const dom = ReactDOM.findDOMNode(this);

    const options = this.props.options || {};

    if (!options.extensions) options.extensions = {};

    options.disableDoubleReturn = true;
    options.placeholder = options.placeholder || { hideOnClick: false };
    options.placeholder.text = this.props.placeholder || 'Type your text';

    options.extensions.paste = new CustomPasteHandler();
    options.pasteCallback = this.props.onPaste || (() => { });

    this.medium = new _MediumEditor(dom, options);
    this.medium.subscribe('editableInput', () => {
      this.props.onChange(dom.innerHTML);
    });
    this.medium.subscribe('editablePaste', (e) => {
      if (this.props.onPaste) this.props.onPaste(e);
    });
    this.medium.setContent(this.props.text || '');
  };

  componentDidUpdate = () => {
    this.medium.restoreSelection();
  };

  componentWillUnmount = () => {
    this.medium.destroy();
  };

  render() {
    const tag = this.props.tag;
    const childProps = {
      ...this.props
    };
    delete childProps.flushEditorDOM;

    childProps.style = childProps.style || {};
    childProps.style.borderColor = 'lightgray';
    childProps.style.borderStyle = 'solid';
    childProps.style.borderWidth = '1px';
    childProps.style.padding = '7px 15px';

    if (this.medium) {
      this.medium.saveSelection();

      if (this.props.flushEditorDOM) {
        this.medium.setContent(this.props.text || '');
      }
    }

    return React.createElement(tag, childProps);
  }
}
