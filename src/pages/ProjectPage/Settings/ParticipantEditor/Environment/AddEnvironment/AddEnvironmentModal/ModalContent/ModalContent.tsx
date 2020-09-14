import React, { PureComponent } from 'react';
import { oneOf, func, number, bool } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';

import * as css from './modalContent.scss';
import localize from './modalContent.json';

import Input from '../../../../../../../../components/Input';
import Button from '../../../../../../../../components/Button';

export default class ModalContent extends PureComponent<any, any> {
  static propTypes = {
    lang: oneOf(['en', 'ru']).isRequired,
    onAdd: func.isRequired,
    onAddAndClose: func.isRequired,
    pending: bool,
    projectId: number.isRequired
  };

  static defaultProps = {
    pending: false
  };

  constructor(props) {
    super(props);

    this.state = {
      description: '',
      title: ''
    };
  }

  get localizationDictionary() {
    const { lang } = this.props;

    return localize[lang];
  }

  get submitButtonDisabled() {
    const { title } = this.state;

    return !title.trim().length;
  }

  handleChangeFormField = field => event => {
    const {
      target: { value }
    } = event;

    this.setState({ [field]: value });
  };

  handleAdd = () => {
    const { onAdd, projectId } = this.props;
    const { title, description } = this.state;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      projectId,
      setModalContentState: this.setState.bind(this)
    });
  };

  handleAddAndClose = () => {
    const { onAddAndClose, projectId } = this.props;
    const { title, description } = this.state;

    onAddAndClose({
      title: title.trim(),
      description: description.trim(),
      projectId,
      setModalContentState: this.setState.bind(this)
    });
  };

  render() {
    const { pending } = this.props;

    const localizationDictionary = this.localizationDictionary;

    return (
      <form className={css.form}>
        <h3>{localizationDictionary.ADD_ENVIRONMENT}</h3>
        <hr />
        <label className={css.formField}>
          <Row>
            <Col xs={4}>
              <p>{localizationDictionary.TITLE}</p>
            </Col>
            <Col xs>
              <Input
                placeholder={localizationDictionary.TITLE_PLACEHOLDER}
                value={this.state.title}
                onChange={this.handleChangeFormField('title')}
              />
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={4}>
              <p>{localizationDictionary.DESCRIPTION}</p>
            </Col>
            <Col xs>
              <Input
                placeholder={localizationDictionary.DESCRIPTION_PLACEHOLDER}
                value={this.state.description}
                onChange={this.handleChangeFormField('description')}
              />
            </Col>
          </Row>
        </label>
        <Row center="xs">
          <Col xs className={css.buttonContainer}>
            <Button
              loading={pending}
              text={localizationDictionary.ADD}
              addedClassNames={{ [css.addButton]: true }}
              htmlType="submit"
              type="green"
              disabled={this.submitButtonDisabled}
              onClick={this.handleAdd}
            />
          </Col>
          <Col xs className={css.buttonContainer}>
            <Button
              loading={pending}
              text={localizationDictionary.ADD_AND_CLOSE}
              addedClassNames={{ [css.addButton]: true }}
              htmlType="submit"
              type="green"
              disabled={this.submitButtonDisabled}
              onClick={this.handleAddAndClose}
            />
          </Col>
        </Row>
      </form>
    );
  }
}
