import * as yup from 'yup';
import localize from '../Sprint/Sprint.json';

const schema = lang =>
  yup.object({
    name: yup
      .string()
      .label(localize[lang].ENTER_GOAL_NAME)
      .required(localize[lang].MUST_ENTER_GOAL_NAME),
    description: yup
      .string()
      .label(localize[lang].ENTER_DESCRIPTION_GOAL)
      .required(localize[lang].MUST_ENTER_DESCRIPTION),
    plannedExecutionTime: yup
      .date()
      .typeError(localize[lang].MUST_ENTER_EXECUTION_TIME)
      .label(localize[lang].PLANNED_EXECUTION_TIME)
      .required(localize[lang].MUST_ENTER_EXECUTION_TIME)
  });

export default schema;
