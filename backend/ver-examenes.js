// ver-examenes.js
const { MongoClient } = require('mongodb');

async function ver() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    // Ver todas las colecciones
    const colecciones = await db.listCollections().toArray();
    console.log('📋 Colecciones:');
    colecciones.forEach(c => console.log(`  - ${c.name}`));
    
    // Buscar exámenes en cualquier colección
    for (const col of colecciones) {
      const docs = await db.collection(col.name).find({}).toArray();
      if (docs.length > 0 && docs[0].titulo && docs[0].materiaId) {
        console.log(`\n📝 Encontrados en "${col.name}":`);
        docs.forEach(d => console.log(`  - ${d.titulo} (${d.fecha})`));
      }
    }
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
ver();