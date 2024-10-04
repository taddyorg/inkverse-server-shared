const Sentry = require("@sentry/node");

const testProductionCode = false;

function setUpLogger(){
  try{
    Sentry.init({
      dsn: process.env.SENTRY_URL,
    });
  }catch(e){
    console.log('error in Sentry setUpLogger', e);
  }
}

function captureRemoteError(error){
  try{
    if (!(testProductionCode || process.env.NODE_ENV === 'production')){
      console.error('Error', error);
    }
    
    Sentry.captureException(error);
  }catch(e){
    console.log('error in Sentry captureRemoteError', e);
  }
}

function getSafeError({ error, errorType, safeErrorMessage }){  
  const safeError = testProductionCode || process.env.NODE_ENV === 'production' 
    ? new Error(safeErrorMessage)
    : error

  safeError.errorType = errorType || 'unknown'
  
  captureRemoteError(error);
  console.log("Error from getSafeError", safeErrorMessage, error);
  return safeError
}

function errorResponder(error, req, res, next) {
  switch(error.errorType){
    case 'not-found':
      res.status(404).send(error.message);
      return;
    default:
      res.status(500).send(error.message);
      return;
  }
}

module.exports = {
  setUpLogger,
  captureRemoteError,
  getSafeError,
  errorResponder,
}