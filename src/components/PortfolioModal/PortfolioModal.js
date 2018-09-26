import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as css from './PortfolioModal.scss';
import Modal from '../Modal';
import Button from '../Button';
import Select from 'react-select';
const SelectAsync = Select.AsyncCreatable;

import { getPortfolios } from '../../actions/Project';

class PortfolioModal extends Component {
  static propTypes = {
    defaultPortfolio: PropTypes.object,
    getPortfolios: PropTypes.func.isRequired,
    onChoose: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    portfolios: PropTypes.array,
    projectId: PropTypes.number,
    title: PropTypes.string
  };

  constructor(props) {
    super(props);
    const { defaultPortfolio } = this.props;
    this.state = {
      portfolio: defaultPortfolio
        ? {
            label: defaultPortfolio.name,
            value: defaultPortfolio.id
          }
        : null
    };
  }

  handleChoose = () => {
    this.props.onChoose(
      {
        id: this.props.projectId,
        portfolioId: this.state.portfolio ? this.state.portfolio.value : 0
      },
      'Portfolio'
    );
  };

  onPortfolioSelect = e => {
    this.setState({ portfolio: e });
  };

  render() {
    const { title, onClose } = this.props;

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={onClose}>
        <div className={css.changeStage}>
          <h3>{title}</h3>
          <div className={css.modalLine}>
            <SelectAsync
              promptTextCreator={label => `Поиск портфеля '${label}'`}
              searchPromptText={'Введите название портфеля'}
              multi={false}
              ignoreCase={false}
              placeholder="Выберите портфель"
              loadOptions={this.props.getPortfolios}
              filterOption={el => el}
              onChange={this.onPortfolioSelect}
              value={this.state.portfolio}
            />
            <Button type="green" text="ОК" onClick={this.handleChoose} />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  getPortfolios
};

export default connect(
  null,
  mapDispatchToProps
)(PortfolioModal);
