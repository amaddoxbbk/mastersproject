import { TableData } from './seatingUtilities';
import { createBiDirectionalPartnerMapping } from './partnerMappingUtility';

export function mutate(population: TableData[][], initialGuests: any[], maxTableSize: number): TableData[][] {
  const copiedPopulation = JSON.parse(JSON.stringify(population));
  const partnerMapping = createBiDirectionalPartnerMapping(initialGuests);
  const minTableSize = Math.ceil(0.75 * maxTableSize);  // 75% of the full table size

  for (let i = 0; i < copiedPopulation.length; i++) {
    const individual = copiedPopulation[i];
    if (individual.length < 2) {
      continue;
    }

    for (let j = 0; j < 100; j++) {
      let randomTableIndex1 = Math.floor(Math.random() * individual.length);
      let randomTableIndex2 = Math.floor(Math.random() * individual.length);

      while (randomTableIndex1 === randomTableIndex2) {
        randomTableIndex2 = Math.floor(Math.random() * individual.length);
      }

      const table1 = individual[randomTableIndex1].names;
      const table2 = individual[randomTableIndex2].names;

      if (table1.length === 0 || table2.length === 0) {
        continue;
      }

      const randomGuestIndex1 = Math.floor(Math.random() * table1.length);
      const randomGuestIndex2 = Math.floor(Math.random() * table2.length);

      const guest1 = table1[randomGuestIndex1];
      const guest2 = table2[randomGuestIndex2];

      const plusOne1 = partnerMapping[guest1];
      const plusOne2 = partnerMapping[guest2];

      let table1NetChange = 0;
      let table2NetChange = 0;

      // Account for the new plus-ones
      if (plusOne2 && !table1.includes(plusOne2)) {
        table1NetChange += 1;
      }
      if (plusOne1 && !table2.includes(plusOne1)) {
        table2NetChange += 1;
      }

      // Check for maximum and minimum table sizes after accounting for the potential new plus ones
      if (table1.length + table1NetChange > maxTableSize || table2.length + table2NetChange > maxTableSize) {
        continue;
      }
      if (table1.length + table1NetChange - 1 < minTableSize || table2.length + table2NetChange - 1 < minTableSize) {
        continue;
      }

      // Perform the swap
      [table1[randomGuestIndex1], table2[randomGuestIndex2]] = [guest2, guest1];

      if (plusOne1) {
        const indexPlusOne1 = table1.indexOf(plusOne1);
        if (indexPlusOne1 !== -1) {
          table1.splice(indexPlusOne1, 1);
          table2.push(plusOne1);
        }
      }

      if (plusOne2) {
        const indexPlusOne2 = table2.indexOf(plusOne2);
        if (indexPlusOne2 !== -1) {
          table2.splice(indexPlusOne2, 1);
          table1.push(plusOne2);
        }
      }
    }
  }

  return copiedPopulation;
}