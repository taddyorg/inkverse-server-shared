const { SESv2Client } = require("@aws-sdk/client-sesv2");

const REGION = { region: "us-west-2" }; 

const awsConfig = {
	...REGION,
}

const emailCient = new SESv2Client(awsConfig);

module.exports = {
  emailCient,
}