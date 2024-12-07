import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(false); // 비동기작업 완료까지 표시할 로딩 state
  const params = useParams(); // path에 있는 포켓몬 id를 가져오기 위한 useParams
  const baseURL = `https://pokeapi.co/api/v2/pokemon/`;
  useEffect(() => {
    setIsLoading(true);
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

        const DamageRelations = await Promise.all(
          // 데미지 관계데이터 가져오기
          // Promis.all : 비동기작업들을 다 작업한 후 한번에 리턴
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        );
        const formattedPokemonData = {
          // 포켓몬 데이터 가공하기
          id,
          name,
          abilities: formatPokemonAbilities(abilities),
          DamageRelations,
          weight: weight / 10,
          height: height / 10,
          stats: formatPokemonStats(stats),
          types: types.map((i) => i.type.name),
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
        };

        console.log("formattedPokemonData", formattedPokemonData);
        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const formatPokemonAbilities = (Abilities) =>
    // Ability 데이터를 포멧하기
    Abilities.filter((_, index) => index <= 1).map(
      (
        obj // index가 1이하인 ability데이터만 가져오기
      ) => obj.ability.name.replaceAll("-", " ") // 모든 -를 공백으로 변경
    );
  const formatPokemonStats = ([
    // 스텟 데이터 가공하기
    statHP,
    statATK,
    statDEF,
    statSATK,
    statSDEP,
    statSPD, //구조분해로 데이터가져오기
  ]) => [
    { name: "Hit Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEF.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEP.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

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

  if (isLoading) return <div>...loading</div>; // isLoading state가 true면 로딩애니메이션 렌더링
  return <div>DetailPage</div>;
};
export default DetailPage;
