import React, {Component} from 'react';
import * as css from './Icons.scss';
import * as allIcons from './index';

export default class DemoPage extends Component {
  render () {
    const iconsList = [];
    for (const element in allIcons) {
      iconsList.push(<div key={element} className={css.demoIcon}>{allIcons[element]()}<div>{element}</div></div>);
    }
    return (
      <section className={css.demoContainer}>
        {iconsList}
      </section>
    );
  }
}

