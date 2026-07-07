import mongoose, { Schema } from 'mongoose';
// Schema para el subdocumento de horario
const horarioSchema = new Schema({
    dia: { type: String, required: true },
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    aula: { type: String, required: true, default: '' } // ✅ Ahora es obligatorio con default
}, { _id: false });
// Schema principal de Materia
const materiaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    profesor: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#4CAF50'
    },
    horarios: {
        type: [horarioSchema],
        default: []
    },
    usuarioId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.model('Materia', materiaSchema);
//# sourceMappingURL=Materia.js.map