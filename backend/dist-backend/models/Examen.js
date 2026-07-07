import mongoose, { Schema } from 'mongoose';
// Schema principal de Examen
const examenSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    materiaId: {
        type: Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        default: ''
    },
    aula: {
        type: String,
        default: ''
    },
    contenido: {
        type: String,
        default: ''
    },
    nota: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    usuarioId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// El tercer parámetro 'examenes' es el nombre de la colección en MongoDB
export default mongoose.model('Examen', examenSchema, 'examenes');
//# sourceMappingURL=Examen.js.map