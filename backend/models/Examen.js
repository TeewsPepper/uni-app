const mongoose = require('mongoose');

const examenSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, default: '' },
  aula: { type: String, default: '' },
  contenido: { type: String, default: '' },
  nota: { type: Number, min: 0, max: 10, default: null },
  usuarioId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Examen', examenSchema, 'examenes');