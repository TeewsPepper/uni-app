import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface para el documento de Examen
export interface IExamen extends Document {
  titulo: string;
  materiaId: Types.ObjectId;
  fecha: Date;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
  usuarioId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema principal de Examen
const examenSchema = new Schema<IExamen>({
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
export default mongoose.model<IExamen>('Examen', examenSchema, 'examenes');