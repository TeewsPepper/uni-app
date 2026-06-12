const { MongoClient } = require('mongodb');

async function limpiarDB() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('agenda_universitaria');
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('Colecciones encontradas:', collections.map(c => c.name));
    
    // Eliminar TODAS las colecciones
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`🗑️ Eliminada colección ${collection.name}`);
    }
    
    console.log('\n🎉 Base de datos completamente limpia');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

limpiarDB();