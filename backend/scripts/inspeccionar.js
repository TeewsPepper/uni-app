// backend/inspeccionar.js
const { MongoClient } = require('mongodb');

async function inspeccionar() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    // Obtener todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('📁 Colecciones encontradas:');
    collections.forEach(c => console.log(`  - ${c.name}`));
    
    // Inspeccionar cada colección
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`\n📋 ${collection.name}: ${count} documentos`);
      
      if (count > 0) {
        const sample = await db.collection(collection.name).find({}).limit(1).toArray();
        console.log('   Ejemplo:', JSON.stringify(sample[0], null, 2).substring(0, 200));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

inspeccionar();