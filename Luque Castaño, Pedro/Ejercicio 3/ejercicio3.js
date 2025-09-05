import express from 'express';
const app = express();
const port = 3000;

// Array interno para almacenar tareas y sus estados
const tareas = [];

// Middleware
app.use(express.json());

// POST para crear una tarea nueva
app.post('/creartarea', (req, res) => {
    const { nombre, estado } = req.body;

    // Verificamos si la tarea ya existe
    if (tareas.find(tarea => tarea.nombre === nombre)) {
        return res.status(400).json({error: 'La tarea ya existe, intente nuevamente'});
    }
    
    // Si no existe la agregamos al array y mostramos un mensaje exitoso
    tareas.push({nombre, estado});
    res.status(201).json({message : "Tarea cargada con éxito"});
})

// GET para ver todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
})

// GET para ver una tarea segun estado
app.get('/tareas/:estado', (req, res) => {
    const estado = req.params.estado;
    const resultado = tareas.filter((tarea) => tarea.estado === estado);

    res.json(resultado);
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})