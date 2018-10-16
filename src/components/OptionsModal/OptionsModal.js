import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { scroller, Element } from 'react-scroll';
import find from 'lodash/find';
import ReactTooltip from 'react-tooltip';
import { Col, Row } from 'react-flexbox-grid';
import InputNumber from '../InputNumber';
import * as css from './OptionsModal.scss';
import Modal from '../Modal';
import SelectDropdown from '../SelectDropdown';
import { IconClose, IconSearch } from '../Icons';
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
      searchText: '',
      plannedExecutionTime: 0,
      selectedPerformer: props.defaultOption || null
    };
  }

  componentDidMount() {
    const { options, selectedIndex } = this.state;
    addEventListener('keydown', this.moveList);
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

  onSearchTextChange = e => {
    const searchText = e.target.value;
    const searchReg = new RegExp(searchText.toLowerCase());
    this.setState({
      searchText,
      options: this.optionsList.filter(option => option.label.toLowerCase().match(searchReg)),
      selectedIndex: 0
    });
  };

  removeCurrentOption = () => {
    this.handleChoose(notSelectedOption.value);
  };

  getCurrentOption = () => {
    const { options, defaultOption } = this.props;
    return find(options, option => option.value === defaultOption);
  };

  moveList = e => {
    const down = e.keyCode === 40;
    const up = e.keyCode === 38;
    const enter = e.keyCode === 13;
    if (down || up || enter) e.preventDefault();
    const indexIsMax = this.state.selectedIndex === this.state.options.length - 1;
    const indexIsMin = this.state.selectedIndex === 0;
    const onChanged = () => {
      this.list.children[this.state.selectedIndex].focus();
    };

    if (down && !indexIsMax) {
      this.setState(state => ({ selectedIndex: state.selectedIndex + 1 }), onChanged);
    }
    if (up && !indexIsMin) {
      this.setState(state => ({ selectedIndex: state.selectedIndex - 1 }), onChanged);
    }

    if (enter) {
      const { options, selectedIndex } = this.state;
      this.handleChoose(options[selectedIndex].value);
    }
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
    this.props.onChoose(this.state.selectedPerformer);
  };

  render() {
    console.log(this.state);
    const {
      title,
      canBeNotSelected,
      removeCurOptionTip,
      inputPlaceholder,
      noCurrentOption,
      isPerformerChanged
    } = this.props;
    const { options, searchText, selectedIndex } = this.state;
    const currentOption = this.getCurrentOption();

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          <form className={css.createTaskForm}>
            {/* {noCurrentOption ? null : currentOption ? (
            <span
              className={classnames({
                [css.currentOption]: true,
                [css.cantRemove]: !this.props.canBeNotSelected
              })}
            >
              {canBeNotSelected && (
                <div>
                  <div
                    className={css.removeCurrentOption}
                    onClick={this.removeCurrentOption}
                    data-tip={removeCurOptionTip}
                    data-for="removeCurrentOption"
                    data-place="left"
                  >
                    <IconClose />
                  </div>
                  <ReactTooltip id="removeCurrentOption" className="tooltip" />
                </div>
              )}
              {currentOption.label}
            </span>
          ) : (
            <span className={classnames([css.currentOption, css.noOption])}>
              {canBeNotSelected && (
                <div>
                  <div
                    className={css.removeCurrentOption}
                    onClick={this.removeCurrentOption}
                    data-tip={removeCurOptionTip}
                    data-for="removeCurrentOption"
                    data-place="left"
                  >
                    <IconClose />
                  </div>
                  <ReactTooltip id="removeCurrentOption" className="tooltip" />
                </div>
              )}
              {notSelectedOption.label}
            </span>
          )}

          {!isPerformerChanged && (
            <div className={css.inputWrapper}>
              <input
                type="text"
                autoFocus
                className={css.search}
                placeholder={inputPlaceholder}
                value={searchText}
                onChange={this.onSearchTextChange}
              />
              <div className={css.searchIco}>
                <IconSearch />
              </div>
            </div>
          )} */}

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
                  />
                </Col>
              </Row>
            </label>
            <div className={css.changePerformerButton}>
              <Button text="Change Performer" type="green" htmlType="submit" onClick={this.changePerformer} />
            </div>

            {/* <div
            className={css.selectorContainer}
            ref={ref => {
              this.list = ref;
            }}
            id="optionsList"
          >
            {!isPerformerChanged &&
              options.map((option, i) => (
                <Element
                  name={option.value.toString()}
                  key={option.value}
                  className={classnames({
                    [css.option]: true,
                    [css.selected]: selectedIndex === i,
                    [css.noOption]: !option.value,
                    [option.className]: option.className
                  })}
                  autoFocus={selectedIndex === i}
                  onClick={() => this.handleChoose(option.value)}
                  tabIndex={i}
                >
                  {option.label}
                </Element>
              ))}
          </div> */}
          </form>
        </div>
      </Modal>
    );
  }
}

OptionsModal.propTypes = {
  canBeNotSelected: PropTypes.bool,
  defaultOption: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  isPerformerChanged: PropTypes.bool,
  noCurrentOption: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array,
  removeCurOptionTip: PropTypes.string,
  title: PropTypes.string
};

export default OptionsModal;
