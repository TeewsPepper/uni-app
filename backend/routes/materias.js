const express = require("express");
const router = express.Router();
const Materia = require("../models/Materia");
const Tarea = require("../models/Tarea");
const Examen = require("../models/Examen");
const { verificarToken } = require("./auth");

router.use(verificarToken);

// Obtener todas las materias del usuario autenticado
router.get("/", async (req, res) => {
  try {
    console.log("📌 Materias - userId recibido:", req.userId);
    const usuarioId = req.userId;
    const materias = await Materia.find({ usuarioId });
    console.log(
      `📚 Encontradas ${materias.length} materias para usuario ${usuarioId}`,
    );
    res.json(materias);
  } catch (error) {
    console.error("Error en GET /materias:", error);
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva materia
router.post("/", async (req, res) => {
  try {
    const usuarioId = req.userId;
    const { nombre, profesor, color, horarios } = req.body;

    console.log("📥 Creando materia - horarios:", horarios);

    const materia = new Materia({
      nombre,
      profesor: profesor || "",
      color: color || "#0e639c",
      horarios: horarios || [],
      usuarioId,
    });

    await materia.save();
    console.log("✅ Materia creada con horarios:", materia.horarios);
    res.status(201).json(materia);
  } catch (error) {
    console.error("Error en POST /materias:", error);
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una materia y todas sus tareas y exámenes asociados
router.delete("/:id", async (req, res) => {
  try {
    const materia = await Materia.findOne({
      _id: req.params.id,
      usuarioId: req.userId,
    });

    if (!materia) {
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    console.log(`🗑️ Eliminando materia: ${materia.nombre}`);
    console.log(`   - Buscando tareas con materiaId: ${req.params.id}`);
    
    // Eliminar todas las tareas asociadas a esta materia
    const tareasEliminadas = await Tarea.deleteMany({ materiaId: req.params.id });
    console.log(`   - Tareas eliminadas: ${tareasEliminadas.deletedCount}`);
    
    // Eliminar todos los exámenes asociados a esta materia
    const examenesEliminados = await Examen.deleteMany({ materiaId: req.params.id });
    console.log(`   - Exámenes eliminados: ${examenesEliminados.deletedCount}`);
    
    // Eliminar la materia
    await Materia.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: "Materia eliminada correctamente",
      tareasEliminadas: tareasEliminadas.deletedCount,
      examenesEliminados: examenesEliminados.deletedCount
    });
  } catch (error) {
    console.error("Error en DELETE /materias/:id", error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una materia
router.put("/:id", async (req, res) => {
  try {
    const { nombre, profesor, color, horarios } = req.body;

    const materia = await Materia.findOne({
      _id: req.params.id,
      usuarioId: req.userId,
    });

    if (!materia) {
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    // Construir objeto con los campos a actualizar
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (profesor !== undefined) updateData.profesor = profesor;
    if (color !== undefined) updateData.color = color;
    if (horarios !== undefined) updateData.horarios = horarios;

    const materiaActualizada = await Materia.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    console.log(
      "✅ Materia actualizada:",
      materiaActualizada.nombre,
      "Horarios:",
      materiaActualizada.horarios,
    );
    res.json(materiaActualizada);
  } catch (error) {
    console.error("Error en PUT /materias/:id", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;