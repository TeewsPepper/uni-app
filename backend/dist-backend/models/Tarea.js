import mongoose, { Schema } from 'mongoose';
const TareaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    materiaId: {
        type: Schema.Types.ObjectId,
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
export default mongoose.model('Tarea', TareaSchema);
//# sourceMappingURL=Tarea.js.map