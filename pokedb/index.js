const createResponse = require('./createResponse');
const axios = require("axios");
const MAX_CONFIDENCE = 0.6;

const extractEntity = (nlp, entity) => {
    let obj = nlp[entity] && nlp[entity][0];
    if(obj && obj.confidence > MAX_CONFIDENCE) {
        return obj.value;
    } else {
        return null;
    }
}

const getPokemonData = (name) => {
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

const getDailyPokemon = () =>{
	var now = new Date();
	var annee   = now.getFullYear();
	var mois    = now.getMonth() + 1;
	var jour    = now.getDate();
	var seed = annee*mois*jour
	return new Promise(async(resolve,reject)=>{
		try{
			const pokemon = await axios.get(
				"https://pokeapi.co/api/v2/pokemon/"+String(seed%807)+"/");
			resolve(pokemon);
		}
		catch(error){
			reject(error);
		}
	});
}
const getPokemon_by_type = (type)=>{
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

module.exports = nlpData => {
    return new Promise(async function(resolve, reject) {
        let intent = extractEntity(nlpData, 'intent');
        console.log(intent)
        if(intent === 'info')
        {
        	let pokemon = extractEntity(nlpData,'pokemon')
        	let data = await getPokemonData(pokemon)
        	let name = data.data.name
        	let types = []
        	let moves = []
        	let height = data.data.height
        	let weight = data.data.weight
        	let img = data.data.sprites.front_default
        	data.data.types.forEach(element =>{types.push(element.type.name)})
        	data.data.moves.forEach(element=>{moves.push(element.move.name)})
        	let data_pokemon = {
        		name,
        		types,
        		moves,
        		height,
        		weight,
        		img
        	}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        }
        else if (intent === 'PokemonOfTheDay')
        {
        	//console.log('Pokemon of day detected')
        	let pokemon = extractEntity(nlpData,'pokemon')
        	let data = await getDailyPokemon()
        	let name = data.data.name
        	let types = []
        	let moves = []
        	let height = data.data.height
        	let weight = data.data.weight
        	let img = data.data.sprites.front_default
        	data.data.types.forEach(element =>{types.push(element.type.name)})
        	data.data.moves.forEach(element=>{moves.push(element.move.name)})
        	let data_pokemon = {
        		name,
        		types,
        		moves,
        		height,
        		weight,
        		img
        	}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        }
        else if(intent === 'getImage')
        {
        	let pokemon = extractEntity(nlpData,'pokemon')
        	let data = await getPokemonData(pokemon)
        	let name = data.data.name
        	let img = data.data.sprites.front_default
        	let data_pokemon = {
        		name,
        		img
        	}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        }
        else if(intent === 'getStats')
        {
        	let pokemon = extractEntity(nlpData,'pokemon')
        	let data = await getPokemonData(pokemon)
        	let name = data.data.name
        	let speed = data.data.stats[0].base_stat
        	let special_defense = data.data.stats[1].base_stat
        	let special_attack = data.data.stats[2].base_stat
        	let defense = data.data.stats[3].base_stat
        	let attack = data.data.stats[4].base_stat
        	let hp = data.data.stats[5].base_stat
        	let img = data.data.sprites.front_default
        	let data_pokemon = {
        		name,
        		speed,
        		special_defense,
        		special_attack,
        		defense,
        		attack,
        		hp,
        		img
        	}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        }
        else if(intent === 'getType'){
        	let type = extractEntity(nlpData,'poketype')
        	let data = await getPokemon_by_type(type)
        	length = data.data.pokemon.length
        	let random = Math.random() * (length - 0);
        	index = Math.round(random,0)
        	let name = data.data.pokemon[index].pokemon.name
        	let data2 = await getPokemonData(name)
        	let types = []
        	let moves = []
        	let height = data2.data.height
        	let weight = data2.data.weight
        	let img = data2.data.sprites.front_default
        	data2.data.types.forEach(element =>{types.push(element.type.name)})
        	data2.data.moves.forEach(element=>{moves.push(element.move.name)})
        	let data_pokemon = {
        		name,
        		type,	
        		types,
        		moves,
        		height,
        		weight,
        		img
        	}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        } 
        else if(intent === 'getBestbyType'){
        	/*
        	let type = extractEntity(nlpData,'poketype')
        	let data = await getPokemon_by_type(type)
        	let max = 0
        	let name_max2 = []
        	console.log(data.data.pokemon)
        	data.data.pokemon.forEach(async element=>{
				let data2 = await getPokemonData(element.pokemon.name);
				var stats = data2.data.stats
				var sum = 0
				stats.forEach(element =>{
					sum+=element.base_stat;
				})
				if(sum>max)
				{
					console.log("success")
					console.log(max)
					max=sum
					name_max2.push(data2.data.name)
				}
			})
			console.log(name_max2)
        	let data2 = await getPokemonData(name_max)
        	let types = []
        	let moves = []
        	let total_stats = max
        	let height = data2.data.height
        	let weight = data2.data.weight
        	let img = data2.data.sprites.front_default
        	data2.data.types.forEach(element =>{types.push(element.type.name)})
        	data2.data.moves.forEach(element=>{moves.push(element.move.name)})
        	let data_pokemon = {
        		name,
        		total_stats,
        		type,	
        		types,
        		moves,
        		height,
        		weight,
        		img
        	}*/
        	let data_pokemon = {}
        	try{
        		let response = createResponse(intent, data_pokemon)
        		resolve(response)
        	}
        	catch(error){
        		reject(error);
        	}
        }
        else {
            resolve({
                txt: "I'm not sure I understand you!",
                img: null
            });
        }
    });
}

