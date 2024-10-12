const cache: Record<string, unknown> = {};

function getSimpleCache(key: string) {
    return cache[key];
}

function setSimpleCache(key: string, value: unknown) {
    cache[key] = value;
}

export { getSimpleCache, setSimpleCache };