const colorPalette = [
  '#4a657e',
  '#ff7800',
  '#5cb85c',
  '#d9534f',
  '#855dbd',
  '#28854e',
  '#5681aa',
  '#ac3d94',
  '#af3712',
  '#727272',
  '#d1327c',
  '#5d4037',
  '#0375f7',
  '#f0ad4e',
  '#9ca310'
];

let current = 0;

const getRandomColor = () => `#${((0xffffff * Math.random()) | 0).toString(16).padStart(6, '1')}`;

const getColor = () => (colorPalette[current] ? colorPalette[current++] : getRandomColor());

getColor.reset = () => {
  current = 0;
};

export default getColor;
