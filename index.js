process.env.NODE_ENV = "production";
const express = require('express');
const config = require('config');
const port = 8081;
const app = express();
const Nodos = config.get('Nodos');
const actual = config.get('Actual');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const portPim = 8082;
const portBodega = 8083;
const portnodo2 = 3006;
var request = require('request');

var http = require("http");



app.get('/PIM/obtenerCatalogo', (req, res)=>{
    var Pim = WheresPIM();
    if(Pim==actual)
    {
        request.get({
            url: 'http://35.231.130.137:'+portPim+'/PIM/obtenerCatalogo',
            json: true,
            headers: {
                'scope': req.header('scope'),
                'authorization': req.header('authorization')
            }
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
    else
    {

        request.get('http://'+Pim+':'+portPim+'/obtenerCatalogo',function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
});

app.get('/PIM/enriquecerProducto', (req, res)=>{
    var Pim = WheresPIM();
    if(Pim==actual)
    {
        request.get({
            url:'http://35.231.130.137:'+portPim+'/PIM/enriquecerProducto',
            json:true,
            body:req.body,
            headers: {
                'scope': req.header('scope'),
                'authorization': req.header('authorization')
            }
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
    else
    {
        request.get('http://'+Pim+':'+portPim+'/enriquecerProducto',function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
});

app.listen(port, function () {
    console.log("Orquestador iniciado en el puerto: "+ port);
});

function WheresPIM() {
    var regreso = actual;
    Nodos.forEach(function(element) {
        var serve = element.servidor;
        var parts = serve.split('.');
        if(parts[0]=="pim")
        {
         regreso = element.nodo;
        }
    });
    return regreso;
};

function WheresCellar(bodega) {
    var regreso = actual;
    Nodos.forEach(function(element) {
        var serve = element.servidor;
        if(serve==bodega)
        {
            regreso = element.nodo;
        }
    });
    return regreso;
};

app.get('/Bodega/obtenerInventario',(req, res)=>{
    var Bodega = WheresCellar(req.body.destino);

    if(Bodega==actual)
    {
        request.get({
            url:'http://35.231.130.137:' + portBodega + '/Bodega/obtenerInventario',
            json:true,
            body:req.body,
            headers: {
                'scope': req.header('scope'),
                'authorization': req.header('authorization')
            }
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
    else
    {
        request.get({
            url:'http://'+req.body.destino+':'+portBodega+'/Bodega/obtenerInventario',
            json:true,
            body:req.body
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
});

app.post('/Bodega/realizarDespacho',(req, res)=>{
    var Bodega = WheresCellar(req.body.destino);

    if(Bodega==actual)
    {
        request.post({
            url:'http://35.231.130.137:'+portBodega+'/Bodega/realizarDespacho',
            json:true,
            body:req.body,
            headers: {
                'scope': req.header('scope'),
                'authorization': req.header('authorization')
            }
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
    else
    {
        request.get({
            url:'http://'+Bodega+':'+portBodega+'/Bodega/realizarDespacho',
            json:true,
            body:req.body
        },function (error, response, body) {
            var j = JSON.parse(JSON.stringify(body));
            res.jsonp(j);
        });
    }
});
