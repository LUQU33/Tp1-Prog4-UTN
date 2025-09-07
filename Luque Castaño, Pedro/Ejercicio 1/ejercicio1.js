import express from 'express';
const app = express();
const port = 3000;

// Array para guardar los cálculos
const calculos = []

// Middleware
app.use(express.json())

// POST para calculos de perímetro y superficie
app.post('/calculos', (req, res) => {
  const { base, altura } = req.body;
  const keys = Object.keys(req.body)

  // Validaciones
  if (!(keys.length === 2 && keys.includes("base") && keys.includes("altura"))){
    return res.status(400).json({error: "El JSON debe contener únicamente 'base' y 'altura'"})
  };

  const regex = /^\d+(\.\d+)?$/;

  if (!regex.test(base) || !regex.test(altura)) {
    return res.status(400).json({error: "Solo se aceptan valores numéricos positivos"})
  }

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  // Cálculos
  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;

  // Guardar en el array
  calculos.push({ base: baseNum, altura: alturaNum, perimetro, superficie });

  res.json({mensaje: "Datos recibidos y cálculos realizados con éxito"});

})

// GET para obtener los datos de los cálculos realizados
app.get('/calculos', (req, res) => {
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