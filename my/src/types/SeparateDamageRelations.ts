export interface DamageFromAndTo {
  to: SeparateDamages;
  from: SeparateDamages;
}

export interface SeparateDamages {
  no_damage?: Damage[];
  half_damage?: Damage[];
  double_damage?: Damage[];
}

export interface Damage {
  damageValue: string;
  name: string;
  url: string;
}
