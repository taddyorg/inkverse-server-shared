const cache = {};

function getSimpleCache(key) {
    return cache[key];
}

function setSimpleCache(key, value) {
    cache[key] = value;
}

module.exports = { getSimpleCache, setSimpleCache };