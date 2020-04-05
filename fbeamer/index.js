'use strict'

const config = require('./../config');
const crypto = require('crypto');
const request = require('request');
const apiVersion = 'v6.0';


class FBeamer{
	constructor({pageAccessToken, VerifyToken, AppSecret}){
		this.pageAccessToken = pageAccessToken;
		this.VerifyToken = VerifyToken;
		this.AppSecret = AppSecret;
	}

	registerHook(req,res){
		const params = req.query;
		const mode = params['hub.mode'];
		const token = params['hub.verify_token'];
		const challenge = params['hub.challenge'];
		try{
			if(mode === 'subscribe' && token === this.VerifyToken)
				{
					console.log("WebHook Registered !");
					return res.send(challenge);
				}
			else{
				throw "Could not register webhook";
				return res.sendStatus(200);
			}
		}
		catch(e){
			console.log(e);
		}
	}

	verifySignature(req,res,next){
		let rawData = '';

		req.on('data', function(data) {
			rawData += data;
		});

		req.on('end', () => {
			let hash = crypto.createHmac('sha1', this.AppSecret).update(rawData).digest('hex');
			let signature = req.headers['x-hub-signature'];
			if (hash !== signature.split("=")[1]) {
				// Implement a logging and notification mechanism
				console.error("ERROR: INVALID SIGNATURE");
			}

		});
		return next();
		}

	incoming(req,res,cb){
		res.sendStatus(200);
		if(req.body.object === 'page' && req.body.entry)
		{
			let data = req.body;
			data.entry.forEach(pageObj => {
				// Iterate through the messaging Array
				pageObj.messaging.forEach(msgEvent => {
					let messageObj = {
						sender: msgEvent.sender.id,
						timeOfMessage: msgEvent.timestamp,
						message: msgEvent.message
					}
					return cb(messageObj);
				});
			});
		}
	}

	messageHandler(obj){
		let sender = obj.sender;
		let message = obj.message;
		if(message.text){
			obj = {
				sender,
				type : 'text',
				content : message.text
			}
		}
		return obj;
	}

	sendMessage(payload) {
		return new Promise((resolve, reject) => {
			// Create an HTTP POST request
			request({
				uri: 'https://graph.facebook.com/v2.6/me/messages',
				qs: {
					access_token: this.pageAccessToken
				},
				method: 'POST',
				json: payload
			}, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					resolve({
						messageId: body.message_id
					});
				} else {
					reject(error);
				}
			});
		});
	}

	txt(id, text, messaging_type = 'RESPONSE') {
	let obj = {
		messaging_type,
		recipient: {
			id
		},
		message: {
			text
		}
	}

	this.sendMessage(obj)
		.catch(error => console.log(error));
	}
	img(id, url, messaging_type = 'RESPONSE') {
		let obj = {
			messaging_type,
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'image',
					payload: {
						url
					}
				}
			}
		}
		this.sendMessage(obj).catch(error => console.log(error));
	}

	sayHi(){
		console.log(this.pageAccessToken);
	}
	get_Page_Access()
	{
		return this.pageAccessToken;
	}
	get_Verify(){
		return this.VerifyToken;
	}
}

module.exports = FBeamer