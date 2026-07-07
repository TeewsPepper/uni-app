const { MongoClient } = require('mongodb');

async function checkUser() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('agenda_universitaria');
  
  const user = await db.collection('user').findOne({});
  console.log('Estructura del usuario:', Object.keys(user));
  console.log('Campos:', Object.keys(user).join(', '));
  
  await client.close();
}

checkUser();