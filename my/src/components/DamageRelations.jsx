import React, { useEffect } from "react";

const DamageRelations = ({ damages }) => {
  console.log(damages);
  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );
    if (arrayDamage.length === 2) {
      // 타입이 2개일 때는
    } else postDamageValue(arrayDamage[0].from);
  }, []);

  return <div></div>;
};

export default DamageRelations;
function postDamageValue(props) {
  console.log("Object.entries(props)", Object.entries(props));
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
  });
}
function separateObjectBetweenToAndFrom(damage) {
  const from = filterDamageRelations("_from", damage);
  const to = filterDamageRelations("_to", damage);

  return { from, to };
}
function filterDamageRelations(valueFilter, damage) {
  const result = Object.entries(damage)
    .filter(([keyName, value]) => {
      return keyName.includes(valueFilter);
    })
    .reduce((acc, [keyName, value]) => {
      const KeyWithValueFilterRemove = keyName.replace(valueFilter, ""); // _from, _to 문자열 지우기
      return (acc = { [KeyWithValueFilterRemove]: value, ...acc });
    }, {});
  return result;
}
