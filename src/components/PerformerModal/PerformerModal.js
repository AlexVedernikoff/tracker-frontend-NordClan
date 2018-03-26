import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { scroller, Element } from 'react-scroll';
import * as css from './PerformerModal.scss';
import Modal from '../Modal';
import { IconClose, IconSearch } from '../Icons';

class PerformerModal extends Component {
  constructor(props) {
    super(props);
    const noPerfromerOption = {
      value: 0,
      label: 'Не выбрано'
    };
    this.userList = this.props.users.concat(noPerfromerOption);
    let selectedIndex = this.userList.length - 1;
    this.props.users.forEach((user, i) => {
      if (user.value === this.props.defaultUser) {
        selectedIndex = i;
      }
    });
    this.state = {
      performer: this.props.defaultUser,
      selectedIndex,
      searchText: '',
      users: this.userList
    };
  }

  componentDidMount() {
    const { users, selectedIndex } = this.state;
    addEventListener('keydown', this.moveList);
    setTimeout(() => {
      scroller.scrollTo(users[selectedIndex].value.toString(), { containerId: 'performerList' });
    }, 100);
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.moveList);
  }

  handleChoose = value => {
    this.props.onChoose(value);
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  removeCurrentPerformer = () => {
    this.setState(
      {
        searchText: '',
        users: this.userList,
        selectedIndex: this.userList.length - 1
      },
      () => {
        scroller.scrollTo(this.state.users[this.state.selectedIndex].value.toString(), {
          containerId: 'performerList'
        });
      }
    );
  };

  onSearchTextChange = e => {
    const searchText = e.target.value;
    const searchReg = new RegExp(searchText.toLowerCase());
    this.setState({
      searchText,
      users: this.userList.filter(user => user.label.toLowerCase().match(searchReg)),
      selectedIndex: 0
    });
  };

  moveList = e => {
    const down = e.keyCode === 40;
    const up = e.keyCode === 38;
    const enter = e.keyCode === 13;
    if (down || up || enter) e.preventDefault();
    const indexIsMax = this.state.selectedIndex === this.state.users.length - 1;
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
      const { users, selectedIndex } = this.state;
      this.handleChoose(users[selectedIndex].value);
    }
  };

  onClose = () => {
    const performerId = this.state.users[this.state.selectedIndex].value;
    this.props.onClose(performerId);
  };

  render() {
    const { title } = this.props;

    const { users, searchText, selectedIndex } = this.state;

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          <div className={css.currentPerformer}>
            {users.length ? users[selectedIndex].label : null}
            {users.length && users[selectedIndex].value !== 0 ? (
              <div className={css.removeCurrentPerformer} onClick={this.removeCurrentPerformer}>
                <IconClose />
              </div>
            ) : null}
          </div>
          <div className={css.inputWrapper}>
            <input
              type="text"
              autoFocus
              className={css.search}
              placeholder="Введите имя исполнителя"
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
            id="performerList"
          >
            {users.map((user, i) => (
              <Element
                name={user.value.toString()}
                key={user.value}
                className={classnames({ [css.user]: true })}
                autoFocus={selectedIndex === i}
                onClick={() => this.handleChoose(user.value)}
                tabIndex={i}
              >
                {user.label}
              </Element>
            ))}
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
