import * as yup from 'yup';
import moment from 'moment';
import localize from '../Sprint/Sprint.json';

yup.addMethod(yup.date, 'handleDate', function(formats) {
  return this.transform(function(value, originalValue) {
    const date = moment(originalValue, formats);
    return date.isValid() ? date.toDate() : new Date('');
  });
});

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
      .min(moment(), localize[lang].CANNOT_SELECT_PAST_DATE)
      .handleDate('DD.MM.YYYY')
      .typeError(localize[lang].MUST_ENTER_EXECUTION_TIME)
      .label(localize[lang].PLANNED_EXECUTION_TIME)
      .required(localize[lang].MUST_ENTER_EXECUTION_TIME),
    visible: yup.bool().label(localize[lang].IS_VISIBLE)
  });

export default schema;
