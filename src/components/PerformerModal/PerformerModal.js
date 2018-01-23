import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { scroller, Element } from 'react-scroll';
import * as css from './PerformerModal.scss';
import Modal from '../Modal';

class PerformerModal extends Component {
  constructor (props) {
    super(props);
    let selectedIndex = 0;
    this.props.users.forEach((user, i) => {
      if (user.value === this.props.defaultUser) {
        selectedIndex = i;
      }
    });
    const noPerfromerOption = {
      value: 0,
      label: 'Не выбрано'
    };
    this.userList = this.props.users.concat(noPerfromerOption);
    this.state = {
      performer: this.props.defaultUser,
      selectedIndex,
      searchText: '',
      users: this.userList
    };
  }

  componentDidMount () {
    const { users, selectedIndex } = this.state;
    addEventListener('keydown', this.moveList);
    setTimeout(
      () => {
        scroller.scrollTo(users[selectedIndex].value.toString(),
        { containerId: 'performerList' });
      },
      100
    );
  }

  componentWillUnmount () {
    removeEventListener('keydown', this.moveList);
  }

  handleChoose = (value) => {
    this.props.onChoose(value);
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  onSearchTextChange = (e) => {
    const searchText = e.target.value;
    const searchReg = new RegExp(searchText.toLowerCase());
    this.setState({
      searchText,
      users: this.userList.filter(user => user.label.toLowerCase().match(searchReg)),
      selectedIndex: 0
    });
  }

  moveList = (e) => {
    const down = (e.keyCode === 40);
    const up = (e.keyCode === 38);
    const enter = (e.keyCode === 13);
    if (down || up || enter) e.preventDefault();
    const indexIsMax = this.state.selectedIndex === this.state.users.length - 1;
    const indexIsMin = this.state.selectedIndex === 0;
    const onChanged = () => {
      this.list.children[this.state.selectedIndex].focus();
    };

    if (down && !indexIsMax) {
      this.setState(
        (state) => ({ selectedIndex: state.selectedIndex + 1 }),
        onChanged
      );
    }
    if (up && !indexIsMin) {
      this.setState(
        (state) => ({ selectedIndex: state.selectedIndex - 1 }),
        onChanged
      );
    }

    if (enter) {
      const { users, selectedIndex } = this.state;
      this.handleChoose(users[selectedIndex].value);
    }
  }

  render () {
    const {
      title,
      onClose
    } = this.props;

    const {
      users,
      searchText,
      selectedIndex
    } = this.state;

    return (
      <Modal
        isOpen
        contentLabel="modal"
        className={css.modalWrapper}
        onRequestClose={onClose}
      >
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          <div className={css.inputWrapper}>
            <div className={css.fakeInput}>
              <span>
                {searchText}
              </span>
              {/* <span>
                {searchText}
              </span> */}
            </div>
            <input
              type="text"
              autoFocus
              className={css.search}
              placeholder="Введите имя исполнителя"
              value={searchText}
              onChange={this.onSearchTextChange}
            />
          </div>
          <div className={css.selectorContainer} ref={ref => {this.list = ref;}} id="performerList">
            {
              users.map((user, i) => (
                <Element
                  name={user.value.toString()}
                  key={user.value}
                  className={classnames({[css.user]: true, [css.selected]: selectedIndex === i})}
                  autoFocus={selectedIndex === i}
                  onClick={() => this.handleChoose(user.value)}
                  tabIndex={i}
                >
                  {user.label}
                </Element>
              ))
            }
          </div>
        </div>
      </Modal>
    );
  }
}

PerformerModal.propTypes = {
  defaultUser: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  users: PropTypes.array
};

export default PerformerModal;
