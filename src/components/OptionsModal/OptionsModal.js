import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { scroller, Element } from 'react-scroll';
import find from 'lodash/find';
import ReactTooltip from 'react-tooltip';

import * as css from './OptionsModal.scss';
import Modal from '../Modal';
import { IconClose, IconSearch } from '../Icons';

const notSelectedOption = {
  value: 0,
  label: 'Не выбрано'
};

class OptionsModal extends Component {
  constructor(props) {
    super(props);
    this.optionsList = this.getOptionsList(props.options, props.canBeNotSelected);

    this.state = {
      options: this.optionsList,
      selectedIndex: this.getDefaultSelectedIndex(),
      searchText: ''
    };
  }

  componentDidMount() {
    const { options, selectedIndex } = this.state;
    addEventListener('keydown', this.moveList);
    setTimeout(() => {
      scroller.scrollTo(options[selectedIndex].value.toString(), { containerId: 'optionsList' });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ options: [...nextProps.options] });
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.moveList);
  }

  getOptionsList(options, canBeNotSelected) {
    const optionsList = [...options];
    return canBeNotSelected ? optionsList.concat(notSelectedOption) : optionsList;
  }

  getDefaultSelectedIndex() {
    let selectedIndex = this.optionsList.length - 1;
    this.props.options.forEach((option, i) => {
      if (option.value === this.props.defaultOption) {
        selectedIndex = i;
      }
    });
    return selectedIndex;
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

  render() {
    const { title, canBeNotSelected, removeCurOptionTip, inputPlaceholder } = this.props;
    const { options, searchText, selectedIndex } = this.state;
    const currentOption = this.getCurrentOption();

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          {currentOption ? (
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
            <span className={classnames([css.currentOption, css.noOption])}>{notSelectedOption.label}</span>
          )}

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

          <div
            className={css.selectorContainer}
            ref={ref => {
              this.list = ref;
            }}
            id="optionsList"
          >
            {options.map((option, i) => (
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
          </div>
        </div>
      </Modal>
    );
  }
}

OptionsModal.propTypes = {
  canBeNotSelected: PropTypes.bool,
  defaultOption: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array,
  removeCurOptionTip: PropTypes.string,
  title: PropTypes.string
};

export default OptionsModal;
