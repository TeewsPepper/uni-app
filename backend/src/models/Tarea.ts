import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITarea extends Document {
  titulo: string;
  descripcion: string;
  materiaId: Types.ObjectId;  // ✅ Usando ObjectId de mongoose
  fechaEntrega: Date;
  prioridad: 'baja' | 'media' | 'alta';
  completada: boolean;
  usuarioId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TareaSchema: Schema<ITarea> = new Schema<ITarea>(
  {
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
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITarea>('Tarea', TareaSchema);