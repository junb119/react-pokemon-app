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

  const bg = `bg-${pokemon?.type}`; // pokemon?.type : pokemon이 undefined가 아닐때, 즉 존재할 때 type을 가져옴(optional)
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  return (
    <>
      {pokemon && (
        <a
          // aria-label={name}
          href={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >
          <div
            className={`${text} basis h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, "00")}
            {/* 001,002 같은 포멧으로 나오도록 */}
          </div>
          <div className={`w-full f-6 flex items-center justify-center`}>
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
            >
              <img
                src={img}
                alt={name}
                width="100%"
                className={`object-contain h-full`}
              />
            </div>
          </div>
          <div
            className={`${bg} text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1 `}
          >
            {pokemon.name}
          </div>
        </a>
      )}
    </>
  );
};

export default PokeCard;
