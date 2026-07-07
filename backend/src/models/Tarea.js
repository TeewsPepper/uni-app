const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  materiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia',
    required: true
  },
  fechaEntrega: {
    type: Date,
    required: true
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  completada: {
    type: Boolean,
    default: false
  },
  usuarioId: {
    type: String,
    required: true,
    default: 'usuario_demo'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tarea', tareaSchema);