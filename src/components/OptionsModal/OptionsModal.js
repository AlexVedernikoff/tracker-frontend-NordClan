import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';
import find from 'lodash/find';
import { Col, Row } from 'react-flexbox-grid';
import InputNumber from '../InputNumber';
import * as css from './OptionsModal.scss';
import Modal from '../Modal';
import SelectDropdown from '../SelectDropdown';
import { changeTask, publishComment } from '../../actions/Task';

import TextArea from '../TextArea';
import Button from '../Button';

const notSelectedOption = {
  value: 0,
  label: 'Не выбрано'
};

const formLayout = {
  firstCol: 4,
  secondCol: 8
};

class OptionsModal extends Component {
  constructor(props) {
    super(props);

    const { options, canBeNotSelected } = props;
    this.optionsList = this.getOptionsList(options, canBeNotSelected);

    this.state = {
      options: this.optionsList,
      selectedIndex: this.getSelectedIndex(options),
      plannedExecutionTime: props.plannedExecutionTime || 0,
      selectedPerformer: props.defaultOption || null,
      commentText: ''
    };
  }

  componentDidMount() {
    const { options, selectedIndex } = this.state;
    setTimeout(this.scrollToSelectedOption(options, selectedIndex), 100);
  }

  componentWillReceiveProps(nextProps) {
    const { options, canBeNotSelected } = nextProps;
    const newOptions = this.getOptionsList(options, canBeNotSelected);
    const newSelectedIndex = this.getSelectedIndex(options);

    this.setState({ options: newOptions, selectedIndex: newSelectedIndex }, () => {
      this.optionsList = newOptions;
      this.scrollToSelectedOption(newOptions, newSelectedIndex)();
    });
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.moveList);
  }

  scrollToSelectedOption = (options, selectedIndex) => () => {
    if (selectedIndex < 0) {
      return;
    }

    scroller.scrollTo(options[selectedIndex].value.toString(), {
      containerId: 'optionsList',
      offset: 0
    });
  };

  getOptionsList(options, canBeNotSelected) {
    const optionsList = [...options];
    return canBeNotSelected ? optionsList.concat(notSelectedOption) : optionsList;
  }

  getSelectedIndex(options) {
    const foundIndex = options.findIndex(option => option.value === this.props.defaultOption);
    return foundIndex !== -1 ? foundIndex : this.optionsList.length - 1;
  }

  handleChoose = value => {
    this.props.onChoose(value);
  };

  onClose = () => {
    this.props.onClose();
  };

  removeCurrentOption = () => {
    this.handleChoose(notSelectedOption.value);
  };

  getCurrentOption = () => {
    const { options, defaultOption } = this.props;
    return find(options, option => option.value === defaultOption);
  };

  handleChangePlannedTime = plannedExecutionTime => {
    this.setState({ plannedExecutionTime });
  };

  handlePerformerChange = selectedPerformer => {
    this.setState({
      selectedPerformer: selectedPerformer ? selectedPerformer.value : 0
    });
  };

  changePerformer = e => {
    e.preventDefault();
    const { plannedExecutionTime, commentText } = this.state;
    this.props.onChoose(this.state.selectedPerformer);
    this.props.changeTask({
      id: this.props.id,
      plannedExecutionTime
    });
    this.props.publishComment(this.props.id, {
      text: commentText
    });
  };

  setComment = e => {
    this.setState({
      commentText: e.target.value
    });
  };

  render() {
    const { title } = this.props;
    const { options } = this.state;

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          <form className={css.createTaskForm}>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p className={css.label}>Performer: </p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <SelectDropdown
                    name="performer"
                    placeholder="Change the performer"
                    multi={false}
                    className={css.selectPerformer}
                    value={this.state.selectedPerformer}
                    onChange={this.handlePerformerChange}
                    noResultsText="No results"
                    options={options}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p className={css.label}>Planning Time:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <InputNumber
                    min={0}
                    maxLength={5}
                    postfix={'ч.'}
                    onChange={this.handleChangePlannedTime}
                    value={this.state.plannedExecutionTime}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p className={css.label}>Add comment:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <TextArea
                    toolbarHidden
                    placeholder="Add comment here"
                    wrapperClassName={css.taskCommentWrapper}
                    editorClassName={css.taskComment}
                    onChange={this.setComment}
                  />
                </Col>
              </Row>
            </label>
            <div className={css.changePerformerButton}>
              <Button text="Change Performer" type="green" htmlType="submit" onClick={this.changePerformer} />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

OptionsModal.propTypes = {
  canBeNotSelected: PropTypes.bool,
  changeTask: PropTypes.func,
  defaultOption: PropTypes.number,
  id: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  isPerformerChanged: PropTypes.bool,
  noCurrentOption: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array,
  publishComment: PropTypes.func,
  removeCurOptionTip: PropTypes.string,
  title: PropTypes.string
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  changeTask,
  publishComment
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsModal);
