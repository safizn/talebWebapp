import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
let eventEmitter = new (require('events').EventEmitter)
import colors from 'colors' // https://github.com/marak/colors.js/

import route from 'middleware/route/route.js' // Routes & API
import serverCommonFunctionality from 'middleware/serverCommonFunctionality.js' // Middleware extending server functionality
import serverStaticFile from 'middleware/serverStaticFile.js' // Middleware extending server functionality
import rootStaticFile from 'middleware/rootStaticFile.js' // Middleware extending server functionality
import notFound from 'middleware/notFound.js'
import RestApi from 'middleware/database/restEndpointApi.js'
let restEndpointApi = new RestApi('api/v1')
// require(`${AppClass.config.serverBasePath}/configuration.js`) // Load configuration settings.
import Application from 'class/Application.class.js'
import WebappUIClass from 'class/WebappUI.class.js'
import StaticContentClass from 'class/StaticContent.class.js'
import ApiClass from 'class/Api.class.js'
import ConditionTree from 'class/ConditionTree.class.js'
import Condition from 'class/Condition.class.js'

Application.initialize([ConditionTree, Condition]) // allows calling a child class from its parent class.

{
    let Class = WebappUIClass

    Class.middlewareArray = [
        async (context, next) => {
            let instance = new Class() // create new instance for each request.
            instance.context = context; context.instance = instance;
            // instance.middlewareArray.push(middleware)
            await next()
        },
        notFound(),
        rootStaticFile(),
        serverCommonFunctionality(),
        async (context, next) => {
            let isCalledNext = await context.instance.applyConditionCallback(next)
            if(!isCalledNext) next()
        }, 
        async (context, next) => {
            await next()
        }, 
    ]
    Class.applyKoaMiddleware()

    http.createServer(Class.serverKoa.callback())
        .listen(Class.port, ()=> {
            console.log(`${Class.name} listening on port ${Class.port}`.green)
            // eventEmitter.emit('listening')
            // process.emit('listening')
            if(Class.config.DEPLOYMENT == 'development') process.send({ message: 'Server listening'});
        })
    // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
    if(Class.config.ssl) {
        let options = {
            key: fs.readFileSync('./sampleSSL/server.key'),
            cert: fs.readFileSync('./sampleSSL/server.crt')
        }
        https.createServer(options, Class.serverKoa.callback())
            .listen(443, () => {
                console.log(`${Class.name} listening on port 443`.green)
            })  
    }
    
}


{
    let Class = StaticContentClass
    Class.middlewareArray = [
        async (context, next) => {
            let instance = new Class()
            instance.context = context; context.instance = instance;
            // instance.middlewareArray.push(middleware)
            context.set('Access-Control-Allow-Origin', '*')
            await next()
        },
        serverStaticFile(),
    ]
    Class.applyKoaMiddleware()
    http.createServer(Class.serverKoa.callback())
        .listen(Class.port, ()=> {
            console.log(`${Class.name} listening on port ${Class.port}`.green)
        })
}


{
    let Class = ApiClass
    Class.middlewareArray = [
        async (context, next) => {
            let instance = new Class()
            instance.context = context; context.instance = instance;
            // instance.middlewareArray.push(middleware)
            await next()
            context.set('Access-Control-Allow-Origin', '*')
        },
        // async (context, next) => {
        //     context.instance.middlewareArray[0](context, next)
        // },
        serverCommonFunctionality(),
        restEndpointApi.route(),
    ]
    Class.applyKoaMiddleware()

    http.createServer(Class.serverKoa.callback())
        .listen(Class.port, ()=> {
            console.log(`${Class.name} listening on port ${Class.port}`.green)
        })
}




// let Test = WebappUI.constructor.extendedSubclass.instance['Test']
// Test.middlewareArray = [
//     async (context, next) => {
//         await (WebappUIClass.context = context)
//         context.set('Access-Control-Allow-Origin', '*')
//         context.body = 'Using Middleware of Test Server.'
//         await next()
//     }, 
//     serverCommonFunctionality(),
//     async (context, next) => {
//         Test.applyConditionCallback()
//         await next()
//     },
// ]
// Test.applyKoaMiddleware()
// http.createServer(Test.serverKoa.callback())
//     .listen(Test.port, ()=> {
//         console.log(`${Test.constructor.name} listening on port ${Test.port}`.green)
//     })

// _____________________________________________

// TODO: change base url and access-control-allow-origin header according to DEPLOYMENT environment

// // Conneciton ports:
// if (!module.parent || module.parent) { // Dummy for future use // if loaded as a standart script.

// }

// TODO: Look at these libraries:
// import bodyParser from 'koa-bodyparser'
// import session from 'koa-session' // Session
// import push from 'koa-server-push' // HTTP/2 push.
// koa-subdomain

// PURE NODEJS _____________________________________________

// http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'application/json'});
//   response.end(response);
// }).listen(8082)


