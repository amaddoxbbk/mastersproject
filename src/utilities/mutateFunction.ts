import { TableData } from './seatingUtilities';
import { createBiDirectionalPartnerMapping } from './partnerMappingUtility';

export function mutate(population: TableData[][], initialGuests: any[], maxTableSize: number): TableData[][] {
    const copiedPopulation = JSON.parse(JSON.stringify(population));
    const partnerMapping = createBiDirectionalPartnerMapping(initialGuests);
  
    for (let i = 0; i < copiedPopulation.length; i++) {
      const individual = copiedPopulation[i];
      if (individual.length < 2) {
          continue;
      }
  
      for (let j = 0; j < 5; j++) {
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
  
        // Check if the tables can accommodate the guests and their plus-ones
        if ((plusOne1 && table2.includes(plusOne1)) || (plusOne2 && table1.includes(plusOne2))) {
          continue;
        }
  
 // Swap the guests
[table1[randomGuestIndex1], table2[randomGuestIndex2]] = [guest2, guest1];

// If guest1 has a plus-one, also swap them.
if (plusOne1) {
    const indexPlusOne1 = table1.indexOf(plusOne1);
    if (indexPlusOne1 !== -1) {
        // Remove the plus-one from table1.
        table1.splice(indexPlusOne1, 1);
        
        // Add the plus-one to table2.
        table2.push(plusOne1);
    }
}

// If guest2 has a plus-one, also swap them.
if (plusOne2) {
    const indexPlusOne2 = table2.indexOf(plusOne2);
    if (indexPlusOne2 !== -1) {
        // Remove the plus-one from table2.
        table2.splice(indexPlusOne2, 1);
        
        // Add the plus-one to table1.
        table1.push(plusOne2);
    }
}

      }
    }
  
    return copiedPopulation;
  }
  