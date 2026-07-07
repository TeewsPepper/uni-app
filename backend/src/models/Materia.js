const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  aula: { type: String, default: '' }
}, { _id: false });

const materiaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  profesor: { type: String, default: '' },
  color: { type: String, default: '#4CAF50' },
  horarios: { type: [horarioSchema], default: [] },
  usuarioId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Materia", materiaSchema);
