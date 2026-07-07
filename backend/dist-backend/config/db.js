import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        // Event listeners para monitorear la conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
    }
    catch (error) {
        // ✅ CORRECCIÓN: Manejo seguro del error
        if (error instanceof Error) {
            console.error(`❌ MongoDB connection error: ${error.message}`);
        }
        else {
            console.error('❌ MongoDB connection error: Unknown error');
        }
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map