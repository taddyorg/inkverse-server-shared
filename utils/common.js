const crypto = require('crypto');
const { get, omit, pick, isNumber, mapKeys, camelCase, invert } = require("lodash");

const adminUserIdsSet = new Set(JSON.parse(process.env.ADMIN_USER_IDS));
const HASH_VERSION = 1;

function createHashExludingItems({ obj, excludedItems = [] }){
  return createHash({ obj: omit(obj, excludedItems) })
}

function createHashIncludingItems({ obj, onlyIncludedItems = [] }){
  return createHash({ obj: pick(obj, onlyIncludedItems) })
}

function createHash({ obj }){
  const stringifiedObj = JSON.stringify({ ...obj, HASH_VERSION });
  const hashFunction = crypto.createHash('sha256');
  return hashFunction.update(stringifiedObj).digest('hex');
}

function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-4) + '...' : str;
}

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

const arrayToArrayObject = (array, keyField) =>
  array.reduce((obj, item) => {
    const valueAtKey = obj[item[keyField]]
    if (!valueAtKey){
      obj[item[keyField]] = [item];
    }else{
      obj[item[keyField]] = [ ...valueAtKey, item]
    }
    return obj;
  }, {});

const arrayToArrayObjectAtProperty = (array, keyField, value) =>
  array.reduce((obj, item) => {
    const valueAtKey = obj[item[keyField]]
    if (!valueAtKey){
      obj[item[keyField]] = [item[value]];
    }else{
      obj[item[keyField]] = [ ...valueAtKey, item[value]]
    }
    return obj;
  }, {});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

function convertToCamelCase(object) {
  return mapKeys(object, (_, key) => camelCase(key));
}

const getIPAddress = (req) => req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

const inkverseWebsiteUrl = process.env.NODE_ENV === 'production' 
	? 'https://inkverse.co' 
	: 'http://inkverse.test:8082';

const inkverseApiUrl = process.env.NODE_ENV === 'production' 
	? 'https://inkverse.co'
	: 'http://inkverse.test:3000';

function removeHttpFromUrl(url) {
  return url.replace(/^https?:\/\//, '');
}

function prettyEncodeTitle(title) {
  if (!title) return
  return title.toLowerCase().split(" ").join("-").replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\–|\[|\{|\]|\}|\||\\|\'|\<|\,|\>|\?|\/|\”|\“|\"|\’|\;|\:|\.|\_|\s/g, '').replace(/-{2,}/g, '-')
}

function safeStringValue(text, limit = 255) {
  if (!text) { return null }
  return truncate(text, limit)
}

function safeFormattedNumber(number, defaultValue = undefined) {
  if (!number) { return null }
  else if (isNumber(number)) { return number }
  return parseInt(number) || defaultValue
}

function convertTextToBoolean(value){
  if (!value) return false
  const lowercaseValue = value.toString().toLowerCase().trim()
  return lowercaseValue === 'yes' || lowercaseValue === 'true'
}

function safeObjProperties(obj, limit = 2000) {
  if (!obj) { return null }
  const values = Object.values(obj)
  const keys = Object.keys(obj)
  
  const keysAndValues = [...keys, ...values]
  const isUnderLimit = keysAndValues.every(item => item.length < limit)

  if (!isUnderLimit) { throw new Error('safeObjProperties: value or key is over character limits') }
  return obj
}

function safeObjWithVariantKeys(obj, variantKeys = [], limit = 2000) {
  if (!obj) { return null }

  //check valid keys and values
  safeObjProperties(obj, limit)

  const variantKeysSet = new Set(variantKeys)
  const keys = Object.keys(obj)
  const hasInvalidKey = keys.some(key => !variantKeysSet.has(key))
  if (hasInvalidKey) { throw new Error('safeObjWithVariantKeys: key is not in allowed variantKeys') }
  return obj
}

function safeArrayProperties(array, limit = 2000) {
  if (!array) { return null }
  return array.filter(item => item.length < limit)
}

function getInkverseUrl({ type, id, shortUrl, baseUrl = inkverseWebsiteUrl }){
  switch(type){
    case 'comicseries':
      return `${baseUrl}/comics/${shortUrl}`
    case 'comicissue':
      return `${baseUrl}/comics/${shortUrl}/${id}`
    case 'creator':
      return `${baseUrl}/creators/${shortUrl}`
    default:
      throw new Error(`getInkverseUrl: type ${type} is not supported`)
  }
}

module.exports = {
  adminUserIdsSet,
  createHashExludingItems,
  createHashIncludingItems,
  createHash,
  arrayToObject,
  arrayToArrayObject,
  arrayToArrayObjectAtProperty,
  objectMap,
  convertToCamelCase,
  getIPAddress,
  inkverseWebsiteUrl,
  inkverseApiUrl,
  removeHttpFromUrl,
  prettyEncodeTitle,
  safeStringValue,
  safeFormattedNumber,
  convertTextToBoolean,
  safeObjProperties,
  safeObjWithVariantKeys,
  safeArrayProperties,
  getInkverseUrl,
}