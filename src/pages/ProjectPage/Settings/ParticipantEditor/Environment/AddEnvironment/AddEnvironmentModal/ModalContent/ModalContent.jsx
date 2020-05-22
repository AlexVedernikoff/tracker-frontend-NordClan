import React, { PureComponent } from 'react';
import { oneOf } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';

import * as css from './modalContent.scss';
import localize from './modalContent.json';

import Input from '../../../../../../../../components/Input';
import Button from '../../../../../../../../components/Button';

export default class ModalContent extends PureComponent {
  static propTypes = {
    lang: oneOf(['en', 'ru']).isRequired
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

  handleChangeFormField = field => event => {
    const {
      target: { value }
    } = event;

    this.setState({ [field]: value });
  };

  handleSubmit = () => {};

  render() {
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
        <Row>
          <Col xs className={css.buttonContainer}>
            <Button
              text={localizationDictionary.ADD}
              type="primary"
              addedClassNames={{ [css.addButton]: true }}
              icon="IconPlus"
              onClick={this.handleSubmit}
            />
          </Col>
        </Row>
      </form>
    );
  }
}
