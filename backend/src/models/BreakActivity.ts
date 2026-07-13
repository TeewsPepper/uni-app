import mongoose, { Schema, Document } from 'mongoose';

export type BreakActivityType = 'social' | 'cultural' | 'deportivo' | 'descanso';

export interface IBreakActivity extends Document {
  titulo: string;
  descripcion: string;
  tipo: BreakActivityType;
  creadorId: string;
  fecha: string; // ✅ Guardamos como string para evitar problemas de zona horaria
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
  maxParticipantes?: number;
  participantes: string[];
  temaRelacionado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BreakActivitySchema = new Schema<IBreakActivity>(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    tipo: {
      type: String,
      required: [true, 'El tipo es obligatorio'],
      enum: ['social', 'cultural', 'deportivo', 'descanso']
    },
    creadorId: {
      type: String,
      required: true
    },
    fecha: {
      type: String, // ✅ String, no Date
      required: [true, 'La fecha es obligatoria']
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es obligatoria'],
      trim: true
    },
    maxParticipantes: {
      type: Number,
      min: [1, 'El máximo de participantes debe ser al menos 1'],
      max: [100, 'El máximo de participantes no puede exceder 100']
    },
    participantes: {
      type: [String],
      default: []
    },
    temaRelacionado: {
      type: String,
      trim: true,
      maxlength: [50, 'El tema relacionado no puede exceder 50 caracteres']
    }
  },
  {
    timestamps: true
  }
);

BreakActivitySchema.index({ fecha: 1 });
BreakActivitySchema.index({ tipo: 1 });
BreakActivitySchema.index({ creadorId: 1 });
BreakActivitySchema.index({ temaRelacionado: 1 });

export default mongoose.model<IBreakActivity>('BreakActivity', BreakActivitySchema);