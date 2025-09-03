const express = require('express');
const app = express();
const port = 3000;

// Array para guardar los cálculos
const calculos = []

// Middleware
app.use(express.json())

// POST para calculos de perímetro y superficie
app.post('/calcular', (req, res) => {
  const { base, altura } = req.body;

  // Cálculos
  const perimetro = 2 * (base + altura);
  const superficie = base * altura;

  // Guardar en el array
  calculos.push({ base, altura, perimetro, superficie });

  res.json({mensaje: "Datos recibidos y cálculos realizados con éxito"});

})

// GET para obtener los datos de los cálculos realizados
app.get('/datos', (req, res) => {
  const resultado = calculos.map( e => (
    {
      ...e,
      tipo: (e.base === e.altura) ? 'cuadrado' : 'rectángulo'
    }
  ));
  res.json(resultado);
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})