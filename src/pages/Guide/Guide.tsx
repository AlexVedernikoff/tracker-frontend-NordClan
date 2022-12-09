import React, { Component } from 'react';
import * as css from './Guide.scss';
import localize from './Guide.json';
import { Link } from 'react-router';

import { connect } from 'react-redux';

interface Props {
  lang: string
}

class Guide extends Component<Props> {

  render() {
    const { lang } = this.props;

    return (
      <section>
        <header className={css.title}>
          {<h1 className={css.title}>{localize[lang].TITLE}</h1>}
        </header>
        {<h2 className={css.title}>{localize[lang].TIME_REPORT}</h2>}
        <Link
          className={css.links}
          to={{
            pathname: '/timereports?guide=true?to_write_off_time'
          }}
        >
          {localize[lang].TO_WRITE_OFF_TIME}
        </Link>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(Guide);
