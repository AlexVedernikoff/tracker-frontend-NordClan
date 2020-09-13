import React, { Component } from 'react';
import Title from '../../../components/Title';
import Button from '../../../components/Button';
import ScrollTop from '../../../components/ScrollTop';
import css from './ListTestPlan.scss';

class ListTestPlan extends Component {
  render() {
    return (
      <div>
        <Title render={'Test plans'} />
        <section>
          <header>
            <h1 className={css.title}>Testing Case Reference</h1>
            <div>
              <Button onClick={this.handleModalOpening} text={'Create Test Case'} type="primary" icon="IconPlus" />
            </div>
          </header>
          <hr />
        </section>
        <ScrollTop />
      </div>
    );
  }
}

export default ListTestPlan;
