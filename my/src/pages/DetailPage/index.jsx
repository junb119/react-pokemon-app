import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const params = useParams(); // path에 있는 포켓몬 id를 가져오기 위한 useParams
  const baseURL = `https://pokeapi.co/api/v2/pokemon/`;
  useEffect(() => {
    fetchPokemonData(params.id);
  }, [params]);

  async function fetchPokemonData(pokemonId) {
    // 포켓몬 데이터 가져오고 가공하기
    const url = `${baseURL}${pokemonId}/`;
    try {
      const { data: pokemonData } = await axios.get(url); // data의 이름을 pokemonData로 지정

      if (pokemonData) {
        // 만약 포켓몬 데이터를 가져왔다면
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData; // 여러 데이터로 구조분해
        console.log("pokemonData", pokemonData);
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id); // 이전, 다음 포켓몬데이터 가져오기
        console.log(nextAndPreviousPokemon);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function getNextAndPreviousPokemon(id) {
    // 이전, 다음 포켓몬데이터 가져오기
    const urlPokemon = `${baseURL}?limit=1&offset=${id - 1}`; // 기준이 되는 포켓몬 데이터 가져오기; 만약 offset=5(6-1)이면 5에서 limit=1을 가져옴 => 6번째 포켓몬
    const { data: pokemonData } = await axios.get(urlPokemon);
    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData?.next)); // 다음 포켓몬데이터가 있다면 다음 포켓몬 정보 가져오기
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData?.previous)); // 이전 포켓몬데이터가 있다면 이전 포켓몬 정보 가져오기
    console.log("nextResponse:", nextResponse);
    console.log("previousResponse:", previousResponse);
    return {
      // 이전, 다음 포켓몬 정보가 있다면 그 포켓몬의 이름 반환
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    };
  }
};

export default DetailPage;
