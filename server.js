'use strict'
const FBeamer = require('./fbeamer');
const config = require('./config');
const pokedb = require('./pokedb');
const express = require('express');
const body_parser =  require('body-parser')

const server = express();
const PORT = process.env.PORT || 3000;

let test = new FBeamer(config.FB);

server.use(body_parser.json())
//Register webhooks
server.get('/', (req,res)=> test.registerHook(req,res));

//Receive & Send messages
server.post('/', (req,res, data)=>{
	return test.incoming(req,res, async data =>{
		let data2 = test.messageHandler(data);
		//console.log(data.message.nlp.entities.poketype)
		pokedb(data.message.nlp.entities).then(response => {
				test.txt(data2.sender, response.txt);
				if (response.img) {
					test.img(data2.sender, response.img);
					}
			})
			.catch(error => {
				console.log(error);
				text.txt(data2.sender, 'My servers are acting up. Do check back later...');
			});
	});
});

//Console confirmation
server.listen(PORT, ()=> console.log('the bot server is running on port ' + PORT));