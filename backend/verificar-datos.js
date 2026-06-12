const { MongoClient } = require('mongodb');

async function verificarDatos() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    // Ver usuarios
    const users = await db.collection('users').find({}).toArray();
    console.log('\n📋 Usuarios:');
    users.forEach(u => {
      console.log(`  - ${u.email} (ID: ${u._id})`);
    });
    
    // Ver materias
    const materias = await db.collection('materias').find({}).toArray();
    console.log(`\n📚 Materias (${materias.length}):`);
    materias.forEach(m => {
      console.log(`  - ${m.nombre} | usuarioId: ${m.usuarioId || 'NO TIENE'}`);
    });
    
    // Ver tareas
    const tareas = await db.collection('tareas').find({}).toArray();
    console.log(`\n✅ Tareas (${tareas.length}):`);
    tareas.forEach(t => {
      console.log(`  - ${t.titulo} | usuarioId: ${t.usuarioId || 'NO TIENE'}`);
    });

     const examenes = await db.collection('examenes').find({}).toArray();
    console.log(`\n✅ Examenes (${examenes.length}):`);
    examenes.forEach(t => {
      console.log(`  - ${t.titulo} | usuarioId: ${t.usuarioId || 'NO TIENE'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

verificarDatos();