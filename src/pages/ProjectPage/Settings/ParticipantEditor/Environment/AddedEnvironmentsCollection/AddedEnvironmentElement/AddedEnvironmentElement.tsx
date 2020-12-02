import React, { PureComponent } from 'react';
import { number, string, arrayOf, func } from 'prop-types';
import { Col } from 'react-flexbox-grid';
import cn from 'classnames';

import RemovableRow from '../../../../../../../components/RemovableRow';

export default class AddedEnvironmentElement extends PureComponent<any, any> {
  static propTypes = {
    classNames: arrayOf(string),
    description: string,
    id: number.isRequired,
    onRemoveEnvironmentElement: func.isRequired,
    projectId: number.isRequired,
    title: string.isRequired
  };

  static defaultProps = {
    classNames: []
  };

  handleClick = () => {
    const { onRemoveEnvironmentElement, id, projectId } = this.props;

    onRemoveEnvironmentElement(id, projectId);
  };

  render() {
    const { title, description, classNames } = this.props;

    return (
      <Col xs={12} className={cn(...classNames)}>
        <RemovableRow title={title} tooltip={description} canRemove onClick={this.handleClick} />
      </Col>
    );
  }
}
