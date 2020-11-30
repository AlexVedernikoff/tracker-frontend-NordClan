import roundNum from './roundNum';
import sortChartLineByDates from './sortChartLineByDates';
import { getBasicLineSettings } from '../pages/ProjectPage/Metrics/Metrics';

export const transformMetrics = metrics => {
  return metrics
    .map(metric => {
      return {
        x: metric.createdAt,
        y: roundNum(+metric.value, 2)
      };
    })
    .sort(sortChartLineByDates);
};

export const makeLine = (metrics, label) => {
  const line = transformMetrics(metrics);
  return {
    data: [...line],
    label: label,
    ...getBasicLineSettings()
  };
};
