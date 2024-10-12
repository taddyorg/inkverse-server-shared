import * as Sentry from "@sentry/node";

const testProductionCode = false;

export function setUpLogger(){
  try{
    Sentry.init({
      dsn: process.env.SENTRY_URL,
    });
  }catch(e){
    console.log('error in Sentry setUpLogger', e);
  }
}

export function captureRemoteError(error: Error) {
  try{
    if (!(testProductionCode || process.env.NODE_ENV === 'production')){
      console.error('Error', error);
    }
    
    Sentry.captureException(error);
  }catch(e){
    console.log('error in Sentry captureRemoteError', e);
  }
}

export function getSafeError(error: Error, errorType: string, safeErrorMessage: string) {  
  const safeError = testProductionCode || process.env.NODE_ENV === 'production' 
    ? new Error(safeErrorMessage)
    : error
  
  captureRemoteError(error);
  console.log("Error from getSafeError", safeErrorMessage, error);
  return safeError
}

// export function errorResponder(error: Error, req: Request, res: Response, next: NextFunction) {
//   switch(error.errorType){
//     case 'not-found':
//       res.status(404).send(error.message);
//       return;
//     default:
//       res.status(500).send(error.message);
//       return;
//   }
// }
