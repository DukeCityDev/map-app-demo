const express = require('express');
let app = express();
const fs = require('fs');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const crimeData = require('./abqdata.json');
const transformation = require('transform-coordinates')
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/public'));

const transform = transformation('3857', 'EPSG:4326')
app.get("/",(req,res)=>{
    res.header("Content-Type",'application/json');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    const {features} = crimeData;
    //only grabbing first 2000 features
    let partialCrimeData = features.slice(0,300);
    //converting coordinate type

    partialCrimeData = partialCrimeData.map(crimeFeature =>{
        //console.log('crime lat lng', crimeFeature.geometry.x, crimeFeature.geometry.y)
        try{
            crimeFeature.geometry = transform.forward(crimeFeature.geometry);
        }catch(e){
            crimeFeature.geometry = null;
        }
        return crimeFeature;
    })
    
    partialCrimeData = partialCrimeData.filter(crimeFeature =>{
        return !!crimeFeature 
    })

    res.send(JSON.stringify(partialCrimeData));
});

app.listen(3001, ()=>{
    console.log("Server is up on port 3001")
}); 
