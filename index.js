process.env.NODE_ENV = "production";
const express = require('express');
const config = require('config');
const port = 80;
const app = express();
const Nodos = config.get('Nodos');
const actual = config.get('Actual');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const portPim = 8002;
const portnodo = 8002;
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
                'scope': 'enriquecerProducto',
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlckludmVudGFyaW8sb2J0ZW5lckludmVudGFyaW8scmVhbGl6YXJEZXNwYWNobyIsImlhdCI6MTU1NzU0Njc5MSwiZXhwIjoxNTU3NTUwMzkxfQ.DZLMgx71EhbhqKv_4EcLji33cBzpxY0p-kVRPaqH-wE'
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
        request.get({url:'http://'+req.body.destino+'/obtenerInventario',json:true,body:req.body},function (error, response, body) {

            res.jsonp(body);
        });
    }
    else
    {
        /*request.get({url:'http://'+Bodega+':'+portnodo2+'/Bodega/obtenerInventario',json:true,body:req.body},function (error, response, body) {
            res.json(body);
        });*/
        request.get({url:'http://'+req.body.destino+'/obtenerInventario',json:true,body:req.body},function (error, response, body) {

            res.jsonp(body);
        });
    }
});

app.post('/Bodega/realizarDespacho',(req, res)=>{
    var Bodega = WheresCellar(req.body.destino);

    if(Bodega==actual)
    {
        request.post({url:'http://'+/*req.body.destino*/'localhost'+':'+portnodo2+'/realizarDespacho',json:true,body:req.body},function (error, response, body) {

            res.jsonp(body);
        });
    }
    else
    {
        request.get({url:'http://'+Bodega+':'+portnodo2+'/Bodega/realizarDespacho',json:true,body:req.body},function (error, response, body) {
            res.jsonp(body);
        });
    }
});
