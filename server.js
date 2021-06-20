const express = require('express');
const app = express();
const router = express.Router();
const routerVista = express.Router();
const handlebars = require('express-handlebars');
const http = require('http').Server(app);
const items = require('./api/productos');
const io = require('socket.io')(http);
const fs=require('fs');
//import fs from 'fs'


const messages = [
    { author: 'bot', date:  new Date().toLocaleString('en-US'), text: '¡Hola! ¿Que tal?' },

];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api',router);
app.use('/productos',routerVista)

//Configiracion de Handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);

app.set("view engine", "hbs");
app.set("views", __dirname + '/views');

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    /* Envio los mensajes al cliente que se conectó */
    socket.emit('productos', items.listar());

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('update', data => {
        io.sockets.emit('productos', items.listar());
    });

    socket.on('new-message', function (data) {
        messages.push(data);
        io.sockets.emit('messages', messages);
        fs.writeFileSync('./public/mensajes.txt', JSON.stringify(messages),error=>{
            if(error){
                console.error("no se guardaron mensajes")
            }else{
                console.log("mensajes guardados")
            }
        });
    });


});

// protejo el servidor ante cualquier excepcion no atrapada
app.use((err, req, res, next) => {
    console.error(err.message);
    return res.status(500).send('Algo se rompio!');
});



//Rutas Plantillas

routerVista.get('/guardar',(req,res)=>{ 
     res.render('guardar')
     
})
routerVista.get('/vista',(req,res)=>{
    res.render('vista',{productos:items.listar(), hayProductos: items.listar().error== undefined})
 })


//Rutas API

router.get('/productos/listar', (req, res) => {
    
    res.send(items.listar())
});
router.get('/productos/listar/:id', (req, res) => {
  
   res.send(items.listar(req.params.id))
});

router.post('/productos/guardar', (req, res) => {
    res.json(items.guardar(req.body))
    res.redirect('/productos/guardar')

});

router.put('/productos/editar/:id', (req, res) => {
 
    res.send(items.editar(req.params.id,req.body))
 
 });
 
 router.delete('/productos/borrar/:id', (req, res) => {

    let eliminado=items.borrar(req.params.id)
   
    res.send(eliminado)

 });




// obtengo el puerto del enviroment o lo seteo por defecto
const PORT = process.env.PORT || 8080;

// pongo a escuchar el servidor en el puerto indicado
const server = http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
