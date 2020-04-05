'use strict'
const FBeamer = require('./fbeamer');
const config = require('./config');

const express = require('express');
const body_parser =  require('body-parser')

const server = express();
const PORT = process.env.PORT || 3000;

let test = new FBeamer(config.FB);
/*
server.post('/', body_parser.json({
	verify: test.verifySignature.call(test);
}));*/
server.use(body_parser.json())
//Register webhooks
server.get('/', (req,res)=> test.registerHook(req,res));

//Receive messages

server.post('/', (req,res, data)=>{
	return test.incoming(req,res, async data =>{
		data = test.messageHandler(data);
		console.log(data);
		try{
			if(data.content==='test')
			{
				await test.img(data.sender, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png')
			}
		}
		catch(e){
			console.log(e);
		}
	});
});



server.listen(PORT, ()=> console.log('the bot server is running on port ' + PORT));