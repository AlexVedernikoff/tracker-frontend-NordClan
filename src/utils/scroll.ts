export const scrollTo = selector => {
  const targetEl = document.querySelector(selector);
  if (targetEl) {
    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
};
