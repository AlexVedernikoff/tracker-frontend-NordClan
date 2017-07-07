import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';

import SelectDropdown from '../../../components/SelectDropdown';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Priority from '../Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';

export default class TaskHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      member: 'member1'
    };
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  render () {
    const { task } = this.props;
    const css = require('./TaskHeader.scss');

    return (
      <div>
        <div className={css.parentTask}>
          <div className={css.prefix} data-tip="Родительская задача ">
            PPJ-56320
          </div>
          <a href="#" className={css.parentTaskName}>
            UI: Add to gulp build tasks for css and js minification
          </a>
        </div>
        <div className={css.taskTopInfo}>
          <div className={css.prefix}>PPJ-56321</div>
          <div>
            <span>Фича / Задача</span>
          </div>
          <Priority priority={task.prioritiesId} />
        </div>
        <TaskTitle name={task.name} />
        <Button
          type="bordered"
          icon="IconClose"
          data-tip="Отменить"
          data-place="bottom"
          addedClassNames={{ [css.buttonCancel]: true }}
        />
        <ButtonGroup type="lifecircle" stage="full">
          <Button
            text="New"
            type="bordered"
            data-tip="Перевести в стадию New"
            data-place="bottom"
            onClick={this.handleOpenModal}
          />
          <Button
            text="Develop"
            type="bordered"
            data-tip="Перевести в стадию Develop"
            data-place="bottom"
            onClick={this.handleOpenModal}
          />
          <Button
            text="Code Review"
            type="green"
            icon="IconPause"
            data-tip="Приостановить"
            data-place="bottom"
          />
          <Button
            text="QA"
            type="bordered"
            data-tip="Перевести в стадию QA"
            data-place="bottom"
            onClick={this.handleOpenModal}
          />
          <Button
            text="Done"
            type="bordered"
            data-tip="Перевести в стадию Done"
            data-place="bottom"
            onClick={this.handleOpenModal}
          />
        </ButtonGroup>
        {/*<Button type="bordered" icon='IconCheck' data-tip="Принять" data-place='bottom' addedClassNames={{[css.buttonOk]: true}} />*/}
        <hr />
        {this.state.isModalOpen
          ? <Modal
              isOpen
              contentLabel="modal"
              className={css.modalWrapper}
              onRequestClose={this.handleCloseModal}
            >
              <div className={css.changeStage}>
                <h3>Перевести в стадию Done</h3>
                <div className={css.modalLine}>
                  <SelectDropdown
                    name="member"
                    placeholder="Введите имя исполнителя..."
                    multi={false}
                    value={this.state.member}
                    onChange={e => this.selectValue(e, 'member')}
                    noResultsText="Нет результатов"
                    options={[
                      { value: 'member1', label: 'Оби-Ван Кеноби' },
                      { value: 'member2', label: 'Александа Одноклассница' },
                      { value: 'member3', label: 'Иосиф Джугашвили' },
                      { value: 'member4', label: 'Андрей Юдин' }
                    ]}
                  />
                  <Button type="green" text="ОК" />
                </div>
              </div>
            </Modal>
          : null}
      </div>
    );
  }
}

TaskHeader.propTypes = {
  css: PropTypes.object,
  task: PropTypes.object.isRequired
};
