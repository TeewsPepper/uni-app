import mongoose, { Schema } from 'mongoose';
// Interfaz para el método estático (opcional)
// export interface IUserModel extends Model<IUser> {
//   // Métodos estáticos aquí
// }
// Definir el esquema
const UserSchema = new Schema({
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
}, {
    timestamps: true
});
// Crear y exportar el modelo
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map