import React, { useEffect } from 'react';
import Joyride from 'react-joyride';
import { getCurrentSteps } from '~/selectors';
import { connect } from 'react-redux';
import { isGuideActive} from '~/guides/utils';

function Guide(props) {
  const { children, conditions = true, steps } = props;

  if (!isGuideActive()) {
    return children;
  }

  return (
    <>
      <Joyride
        run={conditions}
        callback={() => null}
        steps={steps}
        key={steps.map(({ target }) => target).join('')}
      />
      {children}
    </>
  );
}

const mapStateToProps = (state) => ({
  steps: getCurrentSteps(state),
});

export default connect(mapStateToProps)(Guide);
