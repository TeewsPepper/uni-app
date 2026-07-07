// renombrar-coleccion.js
const { MongoClient } = require('mongodb');

async function renombrar() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    // Renombrar examens a examenes
    await db.collection('examens').rename('examenes');
    console.log('✅ Colección renombrada: "examens" → "examenes"');
    
    // Verificar
    const colecciones = await db.listCollections().toArray();
    console.log('📋 Colecciones actualizadas:');
    colecciones.forEach(c => console.log(`  - ${c.name}`));
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await client.close();
  }
}
renombrar();