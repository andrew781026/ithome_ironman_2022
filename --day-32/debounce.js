

export const debounce = (job, delay = 1000) => {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(job, delay);
  }
}
