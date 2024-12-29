import React, { useEffect, useState } from "react";
import { Type } from "./Type";
import {
  DamageRelations as DamageRelationsProps,
  Generation,
} from "../types/DamageRelationOfPokemonType";
import {
  Damage,
  DamageFromAndTo,
  SeparateDamages,
} from "../types/SeparateDamageRelations";

interface DamageModalProps {
  damages: DamageRelationsProps[];
}
interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageModalProps) => {
  // console.log(damages);
  const [damagePokemonForm, setDamagePokemonForm] = useState<SeparateDamages>();
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

  function postDamageValue(props: SeparateDamages): SeparateDamages {
    return Object.entries(props).reduce((acc, [KeyName, value]) => {
      const key = KeyName as keyof typeof props;
      const ValuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      return (acc = {
        [KeyName]: value.map((i: Info[]) => ({
          damageValue: ValuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});
  }
  function separateObjectBetweenToAndFrom(
    damage: DamageRelationsProps
  ): DamageFromAndTo {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    return { from, to };
  }
  function filterDamageRelations(
    valueFilter: string,
    damage: DamageRelationsProps
  ) {
    const result: SeparateDamages = Object.entries(damage)
      .filter(([KeyName, _]) => {
        return KeyName.includes(valueFilter);
      })
      .reduce((acc, [KeyName, value]): SeparateDamages => {
        const KeyWithValueFilterRemove = KeyName.replace(valueFilter, ""); // _from, _to 문자열 지우기
        return (acc = { [KeyWithValueFilterRemove]: value, ...acc });
      }, {});
    return result;
  }
  function joinDamageRelations(props: DamageFromAndTo[]): DamageFromAndTo {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  }
  ``;

  function joinObjects(props: DamageFromAndTo[], string: string) {
    const key = string as keyof (typeof props)[0];
    const FirstArrayValue = props[0][key];
    const SecondArrayValue = props[1][key];

    return Object.entries(SecondArrayValue).reduce(
      (acc, [KeyName, value]: [string, Damage]) => {
        const key = KeyName as keyof typeof FirstArrayValue;
        const result = FirstArrayValue[key]?.concat(value);
        return (acc = { [key]: result, ...acc });
      },
      {}
    );
  }
  function reduceDuplicateValues(props: SeparateDamages) {
    // 중복되는 타입이 있으면 중첩계산하기
    const DuplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };
    return Object.entries(props).reduce((acc, [KeyName, value]) => {
      const key = KeyName as keyof typeof props;
      const verifiedValue = FilterForUniqueValues(value, DuplicateValues[key]);
      return (acc = { [KeyName]: verifiedValue, ...acc });
    }, {});
  }

  // 중복 타입 데미지 계산 함수
  const FilterForUniqueValues = (
    valueForFiltering: Damage[],
    damageValue: string
  ) => {
    // console.log(valueForFiltering,damageValue);
    const initialArray: Damage[] = [];
    return valueForFiltering.reduce((acc, a) => {
      const { url, name } = a;

      const filterACC = acc.filter((v) => v.name !== name); // 중복되지 않는 타입 거르기

      return filterACC.length === acc.length
        ? (acc = [a, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
      // 필터링이 아무것도 안됐으면 그대로, 필터링이 됐으면 새로운 damageValue로 교체
    }, initialArray);
  };
  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(
            ([KeyName, value]: [string, Damage[]]) => {
              const key = KeyName as keyof typeof damagePokemonForm;
              const ValuesOfKeyName = {
                double_damage: "Weak",
                half_damage: "Resistant",
                no_damage: "Immune",
              };
              return (
                <div key={key}>
                  <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                    {ValuesOfKeyName[key]}
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {value.length > 0 ? (
                      value.map(({ name, url, damageValue }) => {
                        return (
                          <Type
                            type={name}
                            key={url}
                            damageValue={damageValue}
                          />
                        );
                      })
                    ) : (
                      <Type type={"none"} key={"none"} />
                    )}
                  </div>
                </div>
              );
            }
          )}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
