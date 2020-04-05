'use strict';
module.exports = (intent, data) => {
    // Create response based on intent
    if(intent === 'info') {
        let {
        name,
        types,
        moves,
        height,
        weight,
        img
        } = data;
        let moves_extract = `${moves[0]} - ${moves[1]} - ${moves[2]}`
        let str = `Some informations about the pokemon you asked : \n Name : ${name} \n Type(s) : ${types.join('-')}\n Move(s) : ${moves_extract} \n Weight : ${weight} \n Height : ${height}`.substring(0, 640);
        return {
            txt: str,
            img: img
        }
    }
    else if (intent === 'PokemonOfTheDay')
    {
        let {
        name,
        types,
        moves,
        height,
        weight,
        img
        } = data;
        let moves_extract = `${moves[0]} - ${moves[1]} - ${moves[2]}`
        let str = `POKEMON OF THE DAY : \n Name : ${name} \n Type(s) : ${types.join('-')}\n Move(s) : ${moves_extract} \n Weight : ${weight} \n Height : ${height}`.substring(0, 640);
        return {
            txt: str,
            img: img
        }
    }
    else if (intent === 'getImage')
    {
        let {
        name,
        img
        } = data;
        let str = `Image of the pokemon : \n ${name}`.substring(0, 640);
        return {
            txt: str,
            img: img
        }
    }
    else if (intent === 'getStats')
    {
        let {
        name,
        speed,
        special_defense,
        special_attack,
        defense,
        attack,
        hp,
        img
        } = data;
        let str = `STATS :  ${name}\nSPEED : ${speed}\nSP_DEF : ${special_defense}\nSP_ATK : ${special_attack}\nATK : ${attack}\nDEF : ${defense}\nHP : ${hp}`.substring(0, 640);
        return {
            txt: str,
            img: img
        }
    }
    else if(intent === 'getType') {
        let {
        name,
        type,
        types,
        moves,
        height,
        weight,
        img
        } = data;
        let moves_extract = `${moves[0]} - ${moves[1]} - ${moves[2]}`
        let str = `Random Pokemon of type ${type}: \n Name : ${name} \n Type(s) : ${types.join('-')}\n Move(s) : ${moves_extract} \n Weight : ${weight} \n Height : ${height}`.substring(0, 640);
        return {
            txt: str,
            img: img
        }
    }
    else if(intent === 'getBestbyType')
    {
        let str = `Working on it !`.substring(0, 640);
        return {
            txt: str,
            img: null
        }
    }
}