import React, { Component } from 'react';
import Modal from 'react-modal';

class CreateSprintModal extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModal}>
        <div>
          <div>
            <Row>
              <Col xsOffset={1} xs={10}>
                <h3>Создание нового спринта</h3>
                <Input
                  placeholder="Введите название спринта..."
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>
            <Row>
              <Col xs>
                <DatepickerDropdown
                  name="dateFrom"
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder="Дата начала"
                />
                <DatepickerDropdown
                  name="dateTo"
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder="Дата окончания"
                />
              </Col>
            </Row>
            <Row>
              <Col xsOffset={1} xs={10}>
                <Input
                  placeholder="Введите время в часах..."
                  onChange={this.onChangeTime}
                />
              </Col>
            </Row>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  text="Создать"
                  onClick={this.createSprint}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CreateSprint;
