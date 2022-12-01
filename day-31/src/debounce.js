const debounce = (job, delay = 1000) => {
    let timer = null;
    return function () {
        timer && clearTimeout(timer);
        timer = setTimeout(job, delay);
    }
}

module.exports = debounce;