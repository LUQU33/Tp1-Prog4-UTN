import express from 'express';
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Array interno para almacenar los alumnos
const alumnos = [];

function estadoAlumno(promedio){
    if (promedio < 6) {
            return 'Reprobado';
        } else if (promedio < 8) {
            return 'Aprobado';
        }   else {
            return 'Promocionado';
        }
}

// POST - Crear un nuevo alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;
    
    // Validacion del JSON de la request
    const keys = Object.keys(req.body)
    if (!(keys.length === 2 && keys.includes("nombre") && keys.includes("notas"))){
        return res.status(400).json({ error: "El JSON debe únicamente contener 'nombre' y 'notas'"});
    }

    // Validar que se proporcionen tres notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Debe proporcionar un array con exactamente tres notas' });
    }

    // Validacion de que el array notas contenga SOLO valores numericos
    const regex = /^\d+(\.\d+)?$/;
    if (!notas.every(nota => regex.test(nota))) {
        return res.status(400).json({ error: "Las notas deben ser valores numéricos"});
    }

    // Verificar que el alumno no exista
    if (alumnos.find(alumno => alumno.nombre === nombre)) {
        return res.status(400).json({ error: 'El alumno ya existe, ingrese otro' });
    }

    const notasNum = notas.map(nota => Number(nota));

    // Agregamose el alumno al array
    alumnos.push({ nombre, notas: notasNum });
    res.status(201).json({ message: 'Alumno creado exitosamente' });
});

// GET - Obtener listado de todos los alumnos
app.get('/alumnos', (req, res) => {
    const resultado = alumnos.map(alumno => {
        const promedio = ((alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3).toFixed(2);

        let estado = estadoAlumno(promedio);

        return { ...alumno, promedio, estado };
    });
    res.json(resultado);
});

// GET - Obtener notas y condición de un alumno en especifico
app.get('/alumnos/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const alumnoEncontrado = alumnos.find(alumno => alumno.nombre === nombre); 

    if (!alumnoEncontrado) {
        return res.status(404).json({error: "Alumno no encontrado"})
    } else {
        const promedio = ((alumnoEncontrado.notas[0] + alumnoEncontrado.notas[1] + alumnoEncontrado.notas[2]) / 3).toFixed(2);

        let estado = estadoAlumno(promedio);

        const resultado = {...alumnoEncontrado, promedio, estado}
        
        res.json(resultado)
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
});