import React, { PureComponent } from 'react';
import { number, string } from 'prop-types';
import { Col } from 'react-flexbox-grid/lib';
import EditableRow from '../../../../../../../components/EditableRow';

export default class AddedEnvironmentElement extends PureComponent {
  static propTypes = {
    description: string,
    id: number.isRequired,
    title: string.isRequired
  };

  render() {
    const { title, description } = this.props;

    return (
      <Col xs={12}>
        <EditableRow title={title} tooltip={description} canEdit onClick={() => null} />
      </Col>
    );
  }
}
