import { CombatResult, Unit, TerrainType } from '../types';

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

type CRTResult = 'AE' | 'AR' | 'NE' | 'DR' | 'DE' | 'EX';

const CRT: Record<string, CRTResult[]> = {
  '1:3': ['AE', 'AE', 'AE', 'AR', 'AR', 'NE'],
  '1:2': ['AE', 'AE', 'AR', 'AR', 'NE', 'NE'],
  '1:1': ['AE', 'AR', 'AR', 'NE', 'NE', 'DR'],
  '3:2': ['AR', 'AR', 'NE', 'NE', 'DR', 'DR'],
  '2:1': ['AR', 'NE', 'NE', 'DR', 'DR', 'DE'],
  '3:1': ['NE', 'NE', 'DR', 'DR', 'DE', 'DE'],
  '4:1': ['NE', 'DR', 'DR', 'DE', 'DE', 'DE'],
};

function getOddsColumn(ratio: number): string {
  if (ratio <= 0.34) return '1:3';
  if (ratio <= 0.6) return '1:2';
  if (ratio <= 1.2) return '1:1';
  if (ratio <= 1.7) return '3:2';
  if (ratio <= 2.5) return '2:1';
  if (ratio <= 3.5) return '3:1';
  return '4:1';
}

export function resolveCombat(
  attacker: Unit,
  defender: Unit,
  defenderTerrain: TerrainType,
  attackerSupplied: boolean,
  defenderSupplied: boolean,
  combatBonus: number
): CombatResult {
  let atkStrength = attacker.attack + combatBonus;
  let defStrength = defender.defense + defenderTerrain.defenseBonus;

  if (attacker.disrupted) atkStrength = Math.max(1, atkStrength - 2);
  if (defender.disrupted) defStrength = Math.max(1, defStrength - 1);
  if (!attackerSupplied) atkStrength = Math.max(1, atkStrength - 1);
  if (!defenderSupplied) defStrength = Math.max(1, defStrength - 1);

  const ratio = atkStrength / Math.max(1, defStrength);
  const oddsCol = getOddsColumn(ratio);
  const roll = rollD6();
  const result = CRT[oddsCol][roll - 1];

  let attackerLoss = 0;
  let defenderLoss = 0;
  let attackerRetreats = false;
  let defenderRetreats = false;
  let desc = '';

  switch (result) {
    case 'AE':
      attackerLoss = Math.ceil(attacker.strength * 0.5);
      attackerRetreats = true;
      desc = `Attacker Eliminated/Routed! ${attacker.name} loses ${attackerLoss} str and retreats.`;
      break;
    case 'AR':
      attackerLoss = 1;
      attackerRetreats = true;
      desc = `Attacker Repulsed. ${attacker.name} loses 1 str and retreats.`;
      break;
    case 'NE':
      desc = 'No Effect. Both sides hold their positions.';
      break;
    case 'DR':
      defenderLoss = 1;
      defenderRetreats = true;
      desc = `Defender Retreats. ${defender.name} loses 1 str and falls back.`;
      break;
    case 'DE':
      defenderLoss = Math.ceil(defender.strength * 0.5);
      defenderRetreats = true;
      desc = `Defender Destroyed/Routed! ${defender.name} loses ${defenderLoss} str and retreats.`;
      break;
    case 'EX':
      attackerLoss = 1;
      defenderLoss = 1;
      defenderRetreats = true;
      desc = `Exchange! Both sides take losses. ${defender.name} retreats.`;
      break;
  }

  desc = `[${oddsCol}, roll ${roll} → ${result}] ${desc}`;

  return { attackerLoss, defenderLoss, attackerRetreats, defenderRetreats, description: desc };
}

export function resolveArtillery(
  targetDefense: number,
  terrainBonus: number,
  isIndustrial: boolean
): { loss: number; disrupted: boolean; description: string } {
  const roll = rollD6();
  const effectiveDefense = targetDefense + terrainBonus + (isIndustrial ? 1 : 0);
  const threshold = Math.max(2, 5 - Math.floor(effectiveDefense / 2));

  if (roll >= threshold + 2) {
    return { loss: 1, disrupted: true, description: `Artillery devastating! Roll ${roll}: 1 str loss + disrupted.` };
  } else if (roll >= threshold) {
    return { loss: 0, disrupted: true, description: `Artillery effective. Roll ${roll}: target disrupted.` };
  } else {
    return { loss: 0, disrupted: false, description: `Artillery misses. Roll ${roll}: no effect.` };
  }
}
