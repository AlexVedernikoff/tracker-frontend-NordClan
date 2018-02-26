const colorPalette = [
  '#e53935',
  '#9c27b0',
  '#1de9b6',
  '#FFEB3B',
  '#304ffe',
  '#00C853',
  '#4dd0e1',
  '#8d6e63',
  '#e91e63',
  '#6200ea',
  '#f44336',
  '#03a9f4',
  '#f9a825',
  '#607d8b',
  '#e65100'
];

let current = 0;

const getRandomColor = () => `#${((0xffffff * Math.random()) | 0).toString(16).padStart(6, '1')}`;

const getColor = () => {
  return colorPalette[current] ? colorPalette[current++] : getRandomColor();
};

getColor.reset = () => {
  current = 0;
};

export default getColor;
