const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Array interno para almacenar los alumnos
const alumnos = [];

// POST - Crear un nuevo alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // Verificar que el alumno no exista
    if (alumnos.find(alumno => alumno.nombre === nombre)) {
        return res.status(400).json({ error: 'El alumno ya existe, ingrese otro' });
    }

    // Validar que se proporcionen tres notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Debe proporcionar un array con exactamente tres notas' });
    }

    // Agregamose el alumno al array
    alumnos.push({ nombre, notas });
    res.status(201).json({ message: 'Alumno creado exitosamente' });
});

// GET - Obtener listado de todos los alumnos
app.get('/alumnos', (req, res) => {
    const resultado = alumnos.map(alumno => {
        const promedio = (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;

        let estado;

        if (promedio < 6) {
            estado = 'Reprobado';
        } else if (promedio < 8) {
            estado = 'Aprobado';
        }   else {
            estado = 'Promocionado';
        }

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
        const promedio = (alumnoEncontrado.notas[0] + alumnoEncontrado.notas[1] + alumnoEncontrado.notas[2]) / 3;

        let estado;

        if (promedio < 6) {
            estado = 'Reprobado';
        } else if (promedio < 8) {
            estado = 'Aprobado';
        }   else {
            estado = 'Promocionado';
        }

        const resultado = {...alumnoEncontrado, promedio, estado}
        
        res.json(resultado)
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
});