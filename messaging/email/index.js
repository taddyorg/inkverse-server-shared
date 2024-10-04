const { SendEmailCommand } = require("@aws-sdk/client-sesv2");
const { emailCient } = require("./setup");

function defaultFrom(audience){
   return 'info@inkverse.co (Inkverse Webtoons)'
}

async function sendEmail(args) {

  const { subject, html, to, audience, from = defaultFrom(audience) } = args;

  if (process.env.NODE_ENV !== "production") {
    console.log('LocalHost Sending email ', args);
    return;
  }

  const params = {
    "Content": { 
       "Simple": { 
          "Body": { 
             "Html": { 
                "Charset": "UTF-8",
                "Data": html
             },
          },
          "Subject": { 
             "Charset": "UTF-8",
             "Data": subject
          }
       },
    },
    "Destination": { 
       "ToAddresses": [ to ]
    },
    "FromEmailAddress": from,
    "ReplyToAddresses": [ from ],
 };

  if (!subject || !html || !to) { 
    throw new Error('Missing required arguments for sendEmail');
  }

  const command = new SendEmailCommand(params);
  await emailCient.send(command);
  
}

module.exports = {
  sendEmail,
}