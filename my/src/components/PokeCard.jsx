import axios from "axios";
import React, { useEffect, useState } from "react";

const PokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState();
  useEffect(() => {
    fetchPokeDetailData();
  }, []);

  async function fetchPokeDetailData() {
    // 포켓몬 정보 가져오기
    try {
      const response = await axios.get(url);
      console.log(response.data);
      const pokemonData = formatPokemonData(response.data);
      setPokemon(pokemonData); // 포멧팅한 데이터 state에 추가
    } catch (error) {
      console.error(error);
    }
  }
  function formatPokemonData(params) {
    // 가져온 포켓몬 정보 포멧팅하기
    const { id, types, name } = params;
    const PokeData = {
      id,
      name,
      type: types[0].type.name, // type의 이름만 가져오기
    };
    return PokeData; //포멧팅한 데이터 반환
  }
  return <div>PokeCard</div>;
};

export default PokeCard;
