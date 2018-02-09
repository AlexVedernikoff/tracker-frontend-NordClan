export default function getRandomColor () {
  return `#${((0xffffff * Math.random()) | 0).toString(16).padStart(6, '1')}`;
}
