import { useMemo, useState } from 'react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';
import { Attributes, Character, Class } from '../types';
import { Control } from './Control';

type EditCharacterProps = {
  character: Character;
  onCharacterChange: (newCharacter: Character) => void;
  onCharacterDeleteClick: (id: number) => void;
};

export const EditCharacter: React.FC<EditCharacterProps> = ({
  character,
  onCharacterChange,
  onCharacterDeleteClick,
}) => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const modifiers: Attributes = useMemo(() => {
    const res = { ...character.attributes };
    Object.keys(character.attributes).forEach((attributeName) => {
      const attributeValue = character.attributes[attributeName];
      const modifierValue = Math.floor((attributeValue - 10) / 2);
      res[attributeName] = modifierValue;
    });
    return res;
  }, [character.attributes]);

  const totalAttributes = useMemo(
    () =>
      Object.values(character.attributes).reduce((sum, val) => sum + val, 0),
    [character.attributes]
  );

  const skillPoints = Math.max(0, 10 + 4 * modifiers.Intelligence);
  const skillPointsUsed = useMemo(() => {
    return Object.keys(character.skills).reduce(
      (sum, skill) => sum + (character.skills[skill] || 0),
      0
    );
  }, [character.skills]);
  const skillPointsAvailable = skillPoints - skillPointsUsed;

  const handleAttributeChange = (attributeName: string, value: number) => {
    if (
      totalAttributes >= 70 &&
      value > (character.attributes[attributeName] || 0)
    ) {
      alert(
        `You have reached the maximum attribute total of 70. Please reduce another attribute to increment ${attributeName}`
      );
      return;
    }

    if (
      attributeName === 'Intelligence' &&
      value < character.attributes.Intelligence &&
      value % 2 > 0 &&
      skillPointsAvailable < 4
    ) {
      alert(
        'Reducing intelligence puts your available skill points below zero. You need more than 4 skill points available to make this change.'
      );
      return;
    }

    const newCharacter: Character = {
      ...character,
      attributes: {
        ...character.attributes,
        [attributeName]: value,
      },
    };
    onCharacterChange(newCharacter);
  };

  const handleSkillPointChange = (skillName: string, value: number) => {
    if (value < 0) {
      return;
    }

    if (
      skillPointsAvailable <= 0 &&
      value > (character.skills[skillName] || 0)
    ) {
      alert('You have no skill points remaining.');
      return;
    }

    const newCharacter: Character = {
      ...character,
      skills: {
        ...character.skills,
        [skillName]: value,
      },
    };
    onCharacterChange(newCharacter);
  };

  return (
    <div
      style={{
        border: '#fff 2px solid',
        paddingBottom: '16px',
      }}
    >
      <h3>{character.name}</h3>
      <button onClick={() => onCharacterDeleteClick(character.id)}>
        Delete character
      </button>
      <div>
        <h4>Attributes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ATTRIBUTE_LIST.map((attributeName) => (
            <Control
              key={attributeName}
              label={`${attributeName} (Modifier: ${modifiers[attributeName]})`}
              value={character.attributes[attributeName]}
              onChange={(value) => handleAttributeChange(attributeName, value)}
            />
          ))}
        </div>
      </div>
      <div>
        <h4>Classes</h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            justifyContent: 'center',
          }}
        >
          {Object.keys(CLASS_LIST).map((className: Class) => {
            const isSelected = selectedClass === className;
            const minAttributes = CLASS_LIST[className];
            const meetsRequirements = Object.keys(minAttributes).reduce(
              (res, attr) =>
                res && character.attributes[attr] >= minAttributes[attr],
              true
            );

            return (
              <div
                key={className}
                style={{
                  cursor: 'pointer',
                  textDecoration: isSelected ? 'underline' : undefined,
                  color: meetsRequirements ? 'green' : 'red',
                }}
                onClick={() => setSelectedClass(isSelected ? null : className)}
              >
                {className}
              </div>
            );
          })}
        </div>
        {selectedClass ? (
          <div>
            <p>Minimum attributes for {selectedClass}:</p>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {Object.keys(CLASS_LIST[selectedClass]).map((attr) => (
                <div>
                  {attr}: {CLASS_LIST[selectedClass][attr]}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div>
        <h4>Skills</h4>
        <p>Available skill points: {skillPoints - skillPointsUsed}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {SKILL_LIST.map((skill) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <Control
                key={skill.name}
                label={`${skill.name} - points`}
                value={character.skills[skill.name] || 0}
                onChange={(value) => handleSkillPointChange(skill.name, value)}
              />
              <>
                modifier ({skill.attributeModifier}):{' '}
                {modifiers[skill.attributeModifier] || 0} total:{' '}
                {(character.skills[skill.name] || 0) +
                  (modifiers[skill.attributeModifier] || 0)}
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
