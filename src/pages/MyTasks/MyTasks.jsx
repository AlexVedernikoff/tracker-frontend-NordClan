import React, { Component } from 'react';
import { exact, string, oneOf } from 'prop-types';
import Title from 'react-title-component';

import AgileBoard from './AgileBoard';
import AgileBoardFilter from './AgileBoardFilter';

import ScrollTop from '../../components/ScrollTop';

import { initialFilters } from './constants';

export default class MyTasks extends Component {
  static propTypes = {
    lang: oneOf(['ru', 'en']),
    localizationDictionary: exact({
      MY_TASKS: string.isRequired
    }).isRequired
  };

  render() {
    const { localizationDictionary, lang } = this.props;

    // const tags = this.props.tags.length ? this.props.tags : this.state.changedTags;

    return (
      <div>
        <Title render={`[Epic] - ${localizationDictionary.MY_TASKS}`} />
        <h1>{localizationDictionary.MY_TASKS}</h1>
        <hr />
        <AgileBoardFilter
          lang={lang}
          // getTasks={this.getTasks}
          initialFilters={initialFilters}
          // tags={concat(tags)}
          // setFilterValue={this.setFilterValue}
        />
        <AgileBoard />
        <ScrollTop />
      </div>
    );
  }
}
