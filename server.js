const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.send('Ruta get')
})

app.get('*', (req,res) => {
    let { url, method } = req;
    res.send(`La ruta ${url} metodo ${method} no esta implementada`);
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
})
