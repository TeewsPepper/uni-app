const { MongoClient, ObjectId } = require('mongodb');

async function verificarDatos() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  
  try {
    await client.connect();
    const db = client.db('agenda_universitaria');
    
    console.log('\n📊 VERIFICANDO BASE DE DATOS\n' + '='.repeat(50));
    
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

    // Ver exámenes con más detalles
    const examenes = await db.collection('examenes').find({}).toArray();
    console.log(`\n📝 EXÁMENES (${examenes.length}):`);
    examenes.forEach(e => {
      console.log(`  - ID: ${e._id}`);
      console.log(`    Título: ${e.titulo}`);
      console.log(`    Nota: ${e.nota !== null && e.nota !== undefined ? e.nota : 'Sin calificar'}`);
      console.log(`    Fecha: ${e.fecha}`);
      console.log(`    MateriaID: ${e.materiaId}`);
      console.log(`    usuarioId: ${e.usuarioId || 'NO TIENE'}`);
      console.log(`    ---`);
    });
    
    // Verificar un examen específico por ID (para probar edición)
    const examenId = process.argv[2]; // Pasar ID como argumento: node script.js EXAMEN_ID
    if (examenId && ObjectId.isValid(examenId)) {
      const examenEspecifico = await db.collection('examenes').findOne({ _id: new ObjectId(examenId) });
      if (examenEspecifico) {
        console.log(`\n🎯 EXAMEN ESPECÍFICO (ID: ${examenId}):`);
        console.log(`  Título: ${examenEspecifico.titulo}`);
        console.log(`  Nota: ${examenEspecifico.nota ?? 'null'}`);
        console.log(`  Fecha: ${examenEspecifico.fecha}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

verificarDatos();