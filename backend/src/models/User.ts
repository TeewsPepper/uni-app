import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para el documento de usuario
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para el método estático (opcional)
// export interface IUserModel extends Model<IUser> {
//   // Métodos estáticos aquí
// }

// Definir el esquema
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { 
    timestamps: true 
  }
);

// Crear y exportar el modelo
const User = mongoose.model<IUser>('User', UserSchema);

export default User;