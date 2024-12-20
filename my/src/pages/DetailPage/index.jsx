import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LessThan } from "../../assets/LessThan";
import { Loading } from "../../assets/Loading";
import { GreaterThan } from "../../assets/GreaterThan";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true); // 비동기작업 완료까지 표시할 로딩 state
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
      setIsLoading(false);
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

  if (isLoading) {
    return (
      // isLoading state가 true면 로딩애니메이션 렌더링
      <div
        className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}
      >
        <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>...NOT FOUND</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;
  return (
    <article className="flex items-center gap-1 flex-col w-fll">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}
        sdfsdf
        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}
      </div>
    </article>
  );
};
export default DetailPage;
