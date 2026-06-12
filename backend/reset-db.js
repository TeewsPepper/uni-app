const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/agenda_universitaria';

const models = {
  Usuario: null,
  Materia: null,
  Tarea: null,
  Examen: null
};

async function resetDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado');

    // 1. Eliminar TODAS las colecciones existentes
    const collections = await mongoose.connection.db.collections();
    console.log(`\n📚 Colecciones encontradas: ${collections.map(c => c.collectionName).join(', ')}`);
    
    for (const collection of collections) {
      await collection.drop();
      console.log(`🗑️ Eliminada: ${collection.collectionName}`);
    }

    // 2. Definir modelos (con nombres de colección explícitos)
    console.log('\n📝 Definiendo modelos...');
    
    // Usuario (usando el esquema real de auth)
    const usuarioSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      nombre: { type: String, default: '' }
    }, { timestamps: true });
    
    // Materia
    const materiaSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      profesor: { type: String, default: '' },
      color: { type: String, default: '#4CAF50' },
      usuarioId: { type: String, required: true }
    }, { timestamps: true });
    
    // Tarea
    const tareaSchema = new mongoose.Schema({
      titulo: { type: String, required: true },
      descripcion: { type: String, default: '' },
      materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
      fechaEntrega: { type: Date, required: true },
      prioridad: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
      completada: { type: Boolean, default: false },
      usuarioId: { type: String, required: true }
    }, { timestamps: true });
    
    // Examen (con collection explícita)
    const examenSchema = new mongoose.Schema({
      titulo: { type: String, required: true },
      materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
      fecha: { type: Date, required: true },
      hora: { type: String, default: '' },
      aula: { type: String, default: '' },
      contenido: { type: String, default: '' },
      nota: { type: Number, min: 0, max: 10, default: null },
      usuarioId: { type: String, required: true }
    }, { 
      timestamps: true,
      collection: 'examenes'  // ← FORZADO a plural correcto
    });

    // Registrar modelos
    const Usuario = mongoose.model('Usuario', usuarioSchema);
    const Materia = mongoose.model('Materia', materiaSchema);
    const Tarea = mongoose.model('Tarea', tareaSchema);
    const Examen = mongoose.model('Examen', examenSchema);

    console.log('✅ Modelos registrados:', mongoose.modelNames());

    // 3. Crear datos de prueba
    console.log('\n📦 Creando datos de prueba...');
    
    // Usuario de prueba
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const usuario = await Usuario.create({
      email: 'prueba@test.com',
      password: hashedPassword,
      nombre: 'Usuario Prueba'
    });
    console.log(`✅ Usuario creado: ${usuario.email} (ID: ${usuario._id})`);

    // Materias
    const materiasData = [
      { nombre: 'Matemáticas', profesor: 'Dr. Pérez', color: '#FF6B6B' },
      { nombre: 'Historia', profesor: 'Dra. González', color: '#4ECDC4' },
      { nombre: 'Programación', profesor: 'Ing. Rodríguez', color: '#45B7D1' }
    ];
    
    const materias = [];
    for (const data of materiasData) {
      const materia = await Materia.create({
        ...data,
        usuarioId: usuario._id.toString()
      });
      materias.push(materia);
      console.log(`✅ Materia creada: ${materia.nombre}`);
    }

    // Tareas
    const tareasData = [
      { titulo: 'Resolver ejercicios', materiaId: materias[0]._id, fechaEntrega: new Date(2026, 5, 20), prioridad: 'alta' },
      { titulo: 'Leer capítulo 5', materiaId: materias[1]._id, fechaEntrega: new Date(2026, 5, 18), prioridad: 'media' },
      { titulo: 'Proyecto final', materiaId: materias[2]._id, fechaEntrega: new Date(2026, 6, 1), prioridad: 'alta' }
    ];
    
    for (const data of tareasData) {
      const tarea = await Tarea.create({
        ...data,
        usuarioId: usuario._id.toString()
      });
      console.log(`✅ Tarea creada: ${tarea.titulo}`);
    }

    // Exámenes
    const examenesData = [
      { titulo: 'Parcial Matemáticas', materiaId: materias[0]._id, fecha: new Date(2026, 5, 25), hora: '09:00', aula: '101' },
      { titulo: 'Examen Historia', materiaId: materias[1]._id, fecha: new Date(2026, 5, 22), hora: '14:00', aula: '203' },
      { titulo: 'Final Programación', materiaId: materias[2]._id, fecha: new Date(2026, 6, 5), hora: '10:00', aula: 'Lab 3' }
    ];
    
    for (const data of examenesData) {
      const examen = await Examen.create({
        ...data,
        contenido: 'Estudiar todos los temas vistos',
        usuarioId: usuario._id.toString()
      });
      console.log(`✅ Examen creado: ${examen.titulo}`);
    }

    // 4. Verificar resultados
    console.log('\n📊 VERIFICACIÓN FINAL:');
    console.log(`👥 Usuarios: ${await Usuario.countDocuments()}`);
    console.log(`📚 Materias: ${await Materia.countDocuments()}`);
    console.log(`✅ Tareas: ${await Tarea.countDocuments()}`);
    console.log(`📝 Exámenes: ${await Examen.countDocuments()}`);
    
    // Mostrar nombres de colecciones
    const finalCollections = await mongoose.connection.db.collections();
    console.log('\n📁 Colecciones finales:');
    finalCollections.forEach(col => {
      console.log(`  - ${col.collectionName}`);
    });

    console.log('\n🎉 RESET COMPLETADO EXITOSAMENTE');
    console.log('\n🔐 Credenciales de prueba:');
    console.log('   Email: prueba@test.com');
    console.log('   Password: 123456');
    
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Ejecutar reset
resetDatabase();