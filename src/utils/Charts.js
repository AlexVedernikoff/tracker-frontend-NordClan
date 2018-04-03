import { defaults } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom';

const chartDefaultOptions = {
  responsive: true,
  hover: { mode: 'nearest' },
  animation: {
    duration: 0
  },
  title: {
    display: false
  },
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    },
    onClick(e, legendItem) {
      const chartItem = this.chart;
      const datasetIndex = legendItem.datasetIndex;
      const defaultLegendClickHandler = defaults.global.legend.onClick.bind(this);
      const dblClickDelay = 300;

      const legendDoubleClickHandler = () => {
        chartItem.data.datasets.forEach((el, index) => {
          const meta = chartItem.getDatasetMeta(index);

          if (index === datasetIndex) {
            meta.hidden = null;
          } else {
            meta.hidden = true;
          }
        });

        chartItem.update();
      };

      if (chartItem.clicked === datasetIndex) {
        legendDoubleClickHandler();
        clearTimeout(chartItem.clickTimeout);
        chartItem.clicked = false;
      } else {
        chartItem.clicked = datasetIndex;

        chartItem.clickTimeout = setTimeout(() => {
          chartItem.clicked = false;
          defaultLegendClickHandler(e, legendItem);
        }, dblClickDelay);
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          displayFormats: {
            day: 'D MMM'
          },
          tooltipFormat: 'DD.MM.YYYY'
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Дата'
        }
      }
    ]
  },
  pan: {
    mode: 'xy'
  },
  zoom: {
    enabled: true,
    mode: 'xy'
  }
};

//Custom plugin which modifies chartjs-plugin-zoom behaviour.
//Disables browser's context menu and resets zoom to the initial level on right mouse button click
const modifyZoomPlugin = {
  beforeInit(chartInstance) {
    chartInstance.modifyZoom = {};
    const node = (chartInstance.modifyZoom.node = chartInstance.chart.ctx.canvas);

    chartInstance.modifyZoom._contextMenuHandler = event => {
      chartInstance.chart.resetZoom();
      event.preventDefault();
    };

    chartInstance.modifyZoom._wheelHandler = event => {
      if (chartInstance.modifyZoom._allowZoom) {
        chartInstance.zoom._wheelHandler(event);
      }
    };

    node.removeEventListener('wheel', chartInstance.zoom._wheelHandler);
    node.addEventListener('wheel', chartInstance.modifyZoom._wheelHandler);
    node.addEventListener('contextmenu', chartInstance.modifyZoom._contextMenuHandler);
  },
  destroy(chartInstance) {
    if (chartInstance.modifyZoom) {
      const node = chartInstance.modifyZoom.node;

      node.removeEventListener('contextmenu', chartInstance.modifyZoom._contextMenuHandler);
      node.removeEventListener('wheel', chartInstance.modifyZoom._wheelHandler);

      delete chartInstance.modifyZoom;
    }
  }
};

export { chartDefaultOptions, modifyZoomPlugin };
