const mongoose = require('mongoose');
require('dotenv').config();

async function limpiarHuerfanos() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agenda_universitaria');
    console.log('✅ Conectado a MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Obtener todos los IDs de materias existentes
    const materias = await db.collection('materias').find({}).toArray();
    const materiasIds = materias.map(m => m._id.toString());
    console.log(`📚 Materias existentes: ${materiasIds.length}`);
    console.log('IDs de materias:', materiasIds);
    console.log('');
    
    // Limpiar tareas huérfanas
    const tareas = await db.collection('tareas').find({}).toArray();
    console.log(`📝 Total de tareas en BD: ${tareas.length}`);
    let tareasEliminadas = 0;
    
    for (const tarea of tareas) {
      const materiaIdStr = tarea.materiaId.toString();
      if (!materiasIds.includes(materiaIdStr)) {
        console.log(`🗑️ Tarea huérfana: "${tarea.titulo}" (materiaId: ${materiaIdStr}) - ELIMINANDO...`);
        await db.collection('tareas').deleteOne({ _id: tarea._id });
        tareasEliminadas++;
      } else {
        console.log(`✅ Tarea válida: "${tarea.titulo}" (materiaId: ${materiaIdStr})`);
      }
    }
    
    // Limpiar exámenes huérfanos
    const examenes = await db.collection('examenes').find({}).toArray();
    console.log(`\n📚 Total de exámenes en BD: ${examenes.length}`);
    let examenesEliminados = 0;
    
    for (const examen of examenes) {
      const materiaIdStr = examen.materiaId.toString();
      if (!materiasIds.includes(materiaIdStr)) {
        console.log(`🗑️ Examen huérfano: "${examen.titulo}" (materiaId: ${materiaIdStr}) - ELIMINANDO...`);
        await db.collection('examenes').deleteOne({ _id: examen._id });
        examenesEliminados++;
      } else {
        console.log(`✅ Examen válido: "${examen.titulo}" (materiaId: ${materiaIdStr})`);
      }
    }
    
    console.log(`\n✅ Limpieza completada:`);
    console.log(`   - ${tareasEliminadas} tareas huérfanas eliminadas`);
    console.log(`   - ${examenesEliminados} exámenes huérfanos eliminados`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

limpiarHuerfanos();