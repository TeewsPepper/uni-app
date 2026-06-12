// eliminar-examens.js
const { MongoClient } = require('mongodb');

async function eliminarColeccionIncorrecta() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    // Eliminar la colección incorrecta
    await db.collection('examens').drop();
    console.log('✅ Colección "examens" eliminada');
    
    console.log('📋 Colecciones restantes:');
    const cols = await db.listCollections().toArray();
    cols.forEach(c => console.log(`  - ${c.name}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

eliminarColeccionIncorrecta();