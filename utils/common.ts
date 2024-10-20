import crypto from 'crypto';

const adminUserIdsSet = new Set(JSON.parse(process.env.ADMIN_USER_IDS || '[]'));

const inkverseWebsiteUrl = process.env.NODE_ENV === 'production' 
	? 'https://inkverse.co' 
	: 'http://inkverse.test:8082';

const inkverseApiUrl = process.env.NODE_ENV === 'production' 
	? 'https://inkverse.co'
	: 'http://inkverse.test:3000';

function removeHttpFromUrl(url: string) {
  return url.replace(/^https?:\/\//, '');
}

function prettyEncodeTitle(title: string) {
  if (!title) return
  return title.toLowerCase().split(" ").join("-").replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\–|\[|\{|\]|\}|\||\\|\'|\<|\,|\>|\?|\/|\”|\“|\"|\’|\;|\:|\.|\_|\s/g, '').replace(/-{2,}/g, '-')
}

function getInkverseUrl(type: string, id: string, shortUrl?: string, baseUrl: string = inkverseWebsiteUrl) {
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