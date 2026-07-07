import mongoose, { Schema, Document } from 'mongoose';

// Interface para el subdocumento de horario
export interface IHorario {
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;  // ✅ Ahora es obligatorio
}

// Interface para el documento de Materia
export interface IMateria extends Document {
  nombre: string;
  profesor: string;
  color: string;
  horarios: IHorario[];
  usuarioId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema para el subdocumento de horario
const horarioSchema = new Schema<IHorario>({
  dia: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  aula: { type: String, required: true, default: '' }  // ✅ Ahora es obligatorio con default
}, { _id: false });

// Schema principal de Materia
const materiaSchema = new Schema<IMateria>({
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

export default mongoose.model<IMateria>('Materia', materiaSchema);