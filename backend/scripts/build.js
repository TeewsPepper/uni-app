import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando build completo...');

try {
  // 1. Construir frontend
  console.log('📦 Construyendo frontend...');
  execSync('cd ../frontend && npm install && npm run build', { 
    stdio: 'inherit',
    shell: true 
  });

  // 2. Crear directorio dist en backend si no existe
  const distPath = path.join(__dirname, '../dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
    console.log('📁 Directorio dist creado');
  }

  // 3. Copiar archivos del frontend (multiplataforma)
  console.log('📋 Copiando frontend al backend...');
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  
  if (fs.existsSync(frontendDist)) {
    // Limpiar directorio dist del backend antes de copiar
    const existingFiles = fs.readdirSync(distPath);
    existingFiles.forEach(file => {
      const filePath = path.join(distPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
    
    // Copiar archivos del frontend
    const files = fs.readdirSync(frontendDist);
    files.forEach(file => {
      const srcFile = path.join(frontendDist, file);
      const destFile = path.join(distPath, file);
      
      if (fs.statSync(srcFile).isDirectory()) {
        copyFolderRecursive(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
      console.log(`✅ Copiado: ${file}`);
    });
    console.log('✅ Frontend copiado exitosamente');
  } else {
    console.error('❌ No se encontró frontend/dist');
    process.exit(1);
  }

  // 4. Construir backend
  console.log('⚙️ Construyendo backend...');
  execSync('npx tsc', { 
    stdio: 'inherit',
    shell: true 
  });

  console.log('✅ Build completado!');

} catch (error) {
  console.error('❌ Error en el build:', error.message);
  process.exit(1);
}

// Función para copiar directorios recursivamente
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}