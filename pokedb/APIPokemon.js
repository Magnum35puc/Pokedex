'use strict';

const axios = require("axios");
const random = require('random');
const seedrandom = require('seedrandom')
exports.getAllPokemons = taille => {
	console.log("success");
	return new Promise(async(resolve,reject)=>{
		try{
			const pokemons = await axios.get(
				"https://pokeapi.co/api/v2/pokemon",
				{
					params : {
						offset:0,
						limit:taille,
					}
				});
			resolve(pokemons);
		}
		catch(error){
			reject(error);
		}
	});
}

function getSinglePokemon(name) {
	//console.log("success");
	return new Promise(async(resolve,reject)=>{
		try{
			const pokemon = await axios.get(
				"https://pokeapi.co/api/v2/pokemon/"+String(name)+"/");
			resolve(pokemon);
		}
		catch(error){
			reject(error);
		}
	});
}

exports.getDailyPokemon= () =>{
	var now = new Date();
	var annee   = now.getFullYear();
	var mois    = now.getMonth() + 1;
	var jour    = now.getDate();
	var seed = annee*mois*jour
	console.log("success");
	return new Promise(async(resolve,reject)=>{
		try{
			const pokemon = await axios.get(
				"https://pokeapi.co/api/v2/pokemon/"+String(seed%964)+"/");
			resolve(pokemon);
		}
		catch(error){
			reject(error);
		}
	});
}

function getPokemon_by_type(type){
	console.log("success");
	return new Promise(async(resolve,reject)=>{
		try{
			const data = await axios.get(
				"https://pokeapi.co/api/v2/type/"+type+"/");
			resolve(data);
		}
		catch(error){
			reject(error);
		}
	});
}
/*
function getPokemonStats(name){
	return new Promise(async(resolve,reject)=>{
		try{
			const data = await axios.get(
				"https://pokeapi.co/api/v2/pokemon/"+String(name)+"/");
			resolve(data);
		}
		catch(error){
			reject(error);
		}
	});
}*/

getPokemon_by_type("grass").then(function(pokemon){
	pokemon = pokemon.data.pokemon
	var sum_tot = []
	pokemon.forEach(element=>{
		getSinglePokemon(element.pokemon.name).then(function(data){
			//console.log(data.data.name)
			var stats = data.data.stats
			var sum = 0
			stats.forEach(element =>{
				sum+=element.base_stat;
				sum_tot.push(sum);
				console.log(sum)
			} )
			//console.log(data.data.stats[1].base_stat);
		})
	})
	sum_tot.forEach(element=>console.log(element))
})

/*
getAllPokemon(1).then(function(pokemons){
	console.log(pokemons);
})*/
/*
getAllPokemons(1).then(function(pokemons){
	//console.log(pokemons.data.results[0].name);
	const name_poke = pokemons.data.results[0].name; 
	getSinglePokemon(name_poke).then(function(pokemon){
		console.log(pokemon)
	})
})*/


