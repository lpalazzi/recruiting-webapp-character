export type Attributes = {
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

export type Class = 'Barbarian' | 'Wizard' | 'Bard';

export type Character = {
  id: number;
  name: string;
  attributes: Attributes;
  skills: { [key: string]: number };
};
