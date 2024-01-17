//const { error } = require('console');
const { error } = require('console');
const fs =  require('fs');  /// fs-file system   get access reading and writing data many more
const http = require('http');
//const path = require('path');
const url = require('url');
const replaceTemplate = require('./starter/Modules/ReplaceTemplate.js');
const slugify = require('slugify');

/////////////////////////////// FILES ////////////////////////

//-------------------- Synchronous way or Blockng way ------------------------------

// const textIn = fs.readFileSync('final/txt/input.txt', 'utf-8');      >>------> Read file 
// console.log(textIn);

// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('final/txt/output.txt', textOut);                   >>------->  Write File
// console.log("File written");

// // The above code will print first (1)Console.log --> (2)readFile

// ----------------- Asynchronous way or Non Blocking way -----------------------

// fs.readFile('final/txt/start.txt', (err, data1) => {         //  () => callback Function     >>------>   Read File
//     if (err) return console.log("ERROR !");

//     fs.readFile(`final/txt/${data1}.txt`, 'utf-8', (err, data2) => {            
//         console.log(data2);
//         fs.readFile('final/txt/append.txt', 'utf-8', (err, data3) => {           
//             console.log(data3);

//             fs.writeFile('final/txt/final.txt',`${data2 }\n${data3}`, 'utf-8', err => {      >>------> Write File       
//                 console.log("Your file has been written");
//             });
//         });
//     });
// });
// console.log("Will read file");  // Print first (1)readFile --> (2)Console.log


// SERVER 



const tempOverview = fs.readFileSync('starter/templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('starter/templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('starter/templates/template-product.html', 'utf-8');

const data = fs.readFileSync('starter/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// ------------ ROUTING ---------------

const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    //console.log(req.url);
    const {query, pathname} = url.parse(req.url, true);
   // const pathName = req.url     // Based on pathName we take decission

    //OverView Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': "text/html"});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(' ');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
       // console.log(output);
        res.end(output);
    }
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        //console.log(query);
        res.end(output);
    }

    // API
    else if (pathname === '/api')
    {
        //fs.readFileSync('starter/dev-data/data.json', 'utf-8');
        //const ProductData = JSON.parse(data);
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // Product Page
    }

    // NOT Found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-error':'hello-world'
        });
        res.end('<h1>Page not found !</h1>');
    }
    //res.end("Hello from the server !");
});

server.listen(8000, '127.0.0.1', () =>{
    console.log('Listening to request on port 8000');
});