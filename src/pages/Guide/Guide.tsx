import React, { useContext, useEffect } from 'react';
import css from './Guide.scss';
import localize from './Guide.json';
import { connect } from 'react-redux';
import store from './store';
import { observer } from 'mobx-react';
import Checkbox from '~/components/Checkbox';
import { GuideHash } from '~/guides/constants';
import { history } from '../../History';
import { setUserGuides } from '~/api/UserGuide';
import { toggleGuideActivation } from '~/guides/utils';

interface Props {
  lang: string
}

const Guide = (props: Props) => {
  const { loadUserGuides, guides } = useContext(store);
  const { lang } = props;

  useEffect(() => {
    toggleGuideActivation(false);
    loadUserGuides();
  }, []);

  useEffect(() => {
    toggleGuideActivation(!(guides.isOffTimeGuideCompleted
      && guides.isOffTimeGuideCompleted
      && guides.isVacationGuideCompleted
  ));
  }, [guides]);

  const setUserGuidesAndRedirect = (guide: GuideHash) => {
    setUserGuides(guide)
      .finally(() => { history.replace(`/timereports${guide}`); });
  };

  return (
    <section>
      <header className={css.title}>
        {<h1 className={css.title}>{localize[lang].TITLE}</h1>}
      </header>
      {<h2 className={css.title}>{localize[lang].TIME_REPORT}</h2>}
      <ul className={css.list}>
        {/* guides are marked as complete here because all axios requests are blocked in the Guide component */}
        <li className={css.guide} onClick={() => setUserGuidesAndRedirect(GuideHash.TO_WRITE_OFF_TIME)}>
          <Checkbox checked={guides.isOffTimeGuideCompleted} disabled />
          <div className={css.link}>
            {localize[lang].TO_WRITE_OFF_TIME}
          </div>
        </li>
        <li className={css.guide} onClick={() => setUserGuidesAndRedirect(GuideHash.VACATION)}>
          <Checkbox checked={guides.isVacationGuideCompleted} disabled />
          <div className={css.link}>
            {localize[lang].VACATION}
          </div>
        </li>
        <li className={css.guide} onClick={() => setUserGuidesAndRedirect(GuideHash.SICK_LEAVE)}>
          <Checkbox checked={guides.isSickLeaveGuideCompleted} disabled />
          <div className={css.link}>
            {localize[lang].SICK_LEAVE}
          </div>
        </li>
      </ul>
    </section>
  );
};

const mapStateToProps = (state) => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(observer(Guide));
