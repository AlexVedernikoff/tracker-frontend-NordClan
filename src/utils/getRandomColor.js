export default function getRandomColor () {
  return `#${((0xFFFFFF * Math.random()) | 0).toString(16).padStart(6, '1')}`;
}
