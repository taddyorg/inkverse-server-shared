const axios = require("axios");

function getListId(listName) {
  switch (listName) {
    case 'signup':
      return process.env.EMAIL_SIGNUPS_LIST_ID;
    default:
      throw new Error(`Email Octopus List ${listName} not found`);
  }
}

async function addContactToList({ listName, contact }) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('LocalHost Adding contact to list ', listName, contact);
    return;
  }

  try{
    const listId = getListId(listName);
    const { name, email, platforms = [] } = contact;
  
    const data = {
        "api_key": process.env.EMAIL_OCTOPUS_API_KEY,
        "email_address": email,
        "fields": {
            ...name && {  
              "Name": name,
              "FirstName": name.split(' ')[0],
            },
        },
        ...platforms.length && { "platforms": platforms },
        "status": "SUBSCRIBED"
    }
  
    const config = {
      method: 'post',
      url: `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
      headers: {
        'Content-Type': `application/json`,
      },
      data,
    }
  
    const response = await axios(config);
    return response.data;
  }catch(err){
    console.log('Error adding contact to list ', listName, contact);
  }
}

module.exports = {
  addContactToList,
}