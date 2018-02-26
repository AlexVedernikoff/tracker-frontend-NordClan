const colorPalette = [
  '#ee221f',
  '#0288d1',
  '#f9a825',
  '#1de9b6',
  '#8a46e9',
  '#0c8b41',
  '#4dd0e1',
  '#cd7edb',
  '#af2f08',
  '#4d5052',
  '#e91e63',
  '#5d4037',
  '#0375f7',
  '#ffeb3b',
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
