import React, { useEffect, useState } from "react";

const DamageRelations = ({ damages }) => {
  // console.log(damages);
  const [damagePokemonForm, setDamagePokemonForm] = useState();
  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );
    if (arrayDamage.length === 2) {
      // 타입이 2개일 때
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
  }, [damages]);

  return <div></div>;
};

function postDamageValue(props) {
  return Object.entries(props).reduce((acc, [KeyName, value]) => {
    const key = KeyName;
    const ValuesOfKeyName = {
      double_damage: "2x",
      half_damage: "1/2x",
      no_damage: "0x",
    };
    return (acc = {
      [KeyName]: value.map((i) => ({
        damageValue: ValuesOfKeyName[key],
        ...i,
      })),
      ...acc,
    });
  }, {});
}
function separateObjectBetweenToAndFrom(damage) {
  const from = filterDamageRelations("_from", damage);
  const to = filterDamageRelations("_to", damage);

  return { from, to };
}
function filterDamageRelations(valueFilter, damage) {
  const result = Object.entries(damage)
    .filter(([KeyName, value]) => {
      return KeyName.includes(valueFilter);
    })
    .reduce((acc, [KeyName, value]) => {
      const KeyWithValueFilterRemove = KeyName.replace(valueFilter, ""); // _from, _to 문자열 지우기
      return (acc = { [KeyWithValueFilterRemove]: value, ...acc });
    }, {});
  return result;
}
function joinDamageRelations(props) {
  return {
    to: joinObjects(props, "to"),
    from: joinObjects(props, "from"),
  };
}

function joinObjects(props, string) {
  const key = string;
  const FirstArrayValue = props[0][key];
  const SecondArrayValue = props[1][key];

  return Object.entries(SecondArrayValue).reduce((acc, [KeyName, value]) => {
    const key = KeyName;
    const result = FirstArrayValue[key]?.concat(value);
    return (acc = { [key]: result, ...acc });
  }, {});
}
function reduceDuplicateValues(props) {
  // 중복되는 타입이 있으면 중첩계산하기
  const DuplicateValues = {
    double_damage: "4x",
    half_damage: "1/4x",
    no_damage: "0x",
  };
  return Object.entries(props).reduce((acc, [KeyName, value]) => {
    const key = KeyName;
    const verifiedValue = FilterForUniqueValues(value, DuplicateValues[key]);
    return (acc = { [KeyName]: verifiedValue, ...acc });
  }, {});
}

// 중복 타입 데미지 계산 함수
const FilterForUniqueValues = (valueForFiltering, damageValue) => {
  // console.log(valueForFiltering,damageValue);
  return valueForFiltering.reduce((acc, a) => {
    const { url, name } = a;
    const filterACC = acc.filter((v) => v.name !== name); // 중복되지 않는 타입 거르기
    return filterACC.length === acc.length
      ? (acc = [a, ...acc])
      : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    // 필터링이 아무것도 안됐으면 그대로, 필터링이 됐으면 새로운 damageValue로 교체
  }, []);
};
export default DamageRelations;
