const express = require("express");
const router = express.Router();
const Examen = require("../models/Examen");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro_cambiame";

// Middleware para obtener usuarioId del token
const getUsuarioId = (req) => {
  const token = req.cookies?.token;
  if (!token) throw new Error("No token");
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.userId;
};

// Obtener todos los exámenes del usuario
router.get('/', async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);
    const examenes = await Examen.find({ usuarioId }).populate('materiaId', 'nombre color'); 
    res.json(examenes);
  } catch (error) {
    console.log('❌ Error GET:', error.message);
    res.status(401).json({ error: 'No autorizado' });
  }
});

// Crear un examen
router.post("/", async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);

    console.log("📥 Datos recibidos:", req.body);
    console.log("👤 usuarioId:", usuarioId);

    const datos = { ...req.body };
    
    // ✅ CORREGIDO: Manejo de fecha sin problemas de zona horaria
    if (datos.fecha) {
      // Si la fecha viene como string YYYY-MM-DD
      if (typeof datos.fecha === 'string' && datos.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = datos.fecha.split('-');
        // Crear fecha a las 00:00:00 en hora local
        datos.fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0);
      }
    }

    const examen = new Examen({ ...datos, usuarioId });
    await examen.save();

   

    // Verificar si realmente existe en BD
    const encontrado = await Examen.findById(examen._id);
    console.log("🔍 ¿Existe en BD?", encontrado ? "SÍ" : "NO");

    res.status(201).json(examen);
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    res.status(401).json({ error: "No autorizado: " + error.message });
  }
});

// Actualizar examen
router.put("/:id", async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);
    const examen = await Examen.findOneAndUpdate(
      { _id: req.params.id, usuarioId },
      req.body,
      { returnDocument: 'after' } // ← Nueva sintaxis
    );
    if (!examen) return res.status(404).json({ error: "No encontrado" });
    res.json(examen);
  } catch (error) {
    res.status(401).json({ error: "No autorizado" });
  }
});

// Eliminar examen
router.delete("/:id", async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);
    const examen = await Examen.findOneAndDelete({
      _id: req.params.id,
      usuarioId,
    });
    if (!examen) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Examen eliminado" });
  } catch (error) {
    res.status(401).json({ error: "No autorizado" });
  }
});

module.exports = router;