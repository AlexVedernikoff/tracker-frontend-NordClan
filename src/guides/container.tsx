import React from 'react';
import { getCurrentSteps } from '~/selectors';
import { connect } from 'react-redux';
import Guide from './Guide';
import { guideIteratorByHash } from './constants';
import { Dispatch } from 'redux';
import { GuideStore } from './store/reducer';
import { FC, useEffect, useState } from 'react';
import { GuideContext } from './context';
import { GuideProps } from './types';
import { isGuideActive } from './utils';

const GuideContainer: FC<GuideProps> = (props) => {
  const { getGuideIterator, children, ...guideProps } = props;

  const [guide, setGuide] = useState<Generator<void, void, unknown> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const guideIterator = getGuideIterator();

    if (guideIterator) {
      setGuide(guideIterator.start());
    }
  }, []);

  if (!isGuideActive()) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <GuideContext.Provider value={{ guide }}>
      <Guide {...guideProps}>
        {children}
      </Guide>
    </GuideContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  steps: getCurrentSteps(state)
});

const mapDispatchToProps = (dispatch: Dispatch<GuideStore>) => ({
  getGuideIterator: () => {
    const guideIterator = guideIteratorByHash[window.location.hash];

    if (guideIterator) {
      return guideIterator(dispatch);
    }

    return null;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideContainer);
