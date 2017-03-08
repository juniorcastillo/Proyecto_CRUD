var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

var bodyParser = require('body-parser');
var app = express()

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));

var dbUrl = 'mongodb://127.0.0.1:27017/gestion'
// ***************************Se encarga de hacer el listado******************************************//
app.get('/', function (req, res) {
  
  

  mongodb.connect(dbUrl, function(err, db){
    let datos = {};

     //Consulta para hacer el listado
      db.collection('usuarios').find().toArray(function(err, docs) {
        datos.usuarios = docs;
        res.render('index', datos);
      });
    
   

    
  });
});

app.get('/formulario', function (req, res) {
  res.render('formulario');
});
// **********Este es el render que envia los datos que se van a modificar los envia por post*******************///
app.post('/modificar', function (req, res) {
   datos = {};

   console.log(req.body);
// Comprobamos si estan definidas o no los datos a modificar
   if(req.body.pais == "undefined"){
     pais = "";
   }else{
     pais = req.body.pais;
   }

   if(req.body.apellido == "undefined"){
     apellido = "";
   }else{
     apellido = req.body.apellido;
   }

   if(req.body.nombre == "undefined"){
     nombre = "";
   }else{
     nombre = req.body.nombre;
   }
   

   let usuario = {
      _id : req.body._id,
      nombre: nombre,
      apellido: apellido,
      edad: req.body.edad,
      pais: pais
   };

   datos.usuario = usuario;

   //enviamos los dotos a modificar en la vista
  res.render('modificar', datos);
});

//*** Inserta los datos en la base de datos *********************//
app.post('/inserta-usuario', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){
    datos = {};
//Creo el object
    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;

    db.collection('usuarios').insert(usuario);//Enserta los datos

   res.redirect("/");
  });
});

//*************Este rendeer se encarga de modificar los datos del usuario***********************//

app.post('/usuario-modificado', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){;

    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;
   
     db.collection('usuarios').find({_id: ObjectId(req.body._id)}).toArray(function(err, p){
     
        p[0].nombre = req.body.nombre,
        p[0].apellido= req.body.apellido,
        p[0].edad= req.body.edad,
        p[0].pais= req.body.pais
        

        db.collection('usuarios').update({_id: ObjectId(req.body._id)},p[0]);
     });
    
   /* db.collection('usuarios').update(id,p);*/

     res.redirect("/");
  });
});

//*************Este render se utiliza para borrar los usaurios**********************************//

app.post('/borrar', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){//conectando a la base de datos
    //crea el objecto borrado y recoge le id
    let borrado = {
      _id: new mongodb.ObjectID(req.body._id)
    };

    db.collection('usuarios').remove(borrado)//borra el usuario que se le a pasado como id 

      res.redirect("/");
  });
});


app.listen(8080, function () {
  console.log('Servidor escuchando en http://localhost:8080')
})
