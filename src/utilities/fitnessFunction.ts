import { TableData } from './seatingUtilities';

// Helper function to calculate escalating empty seat penalty
const calculateEmptySeatPenalty = (emptySeats: number) => {
  let escalatingPenalty = 500;
  let emptySeatPenalty = 0;

  for (let i = 1; i <= emptySeats; i++) {
    emptySeatPenalty += i * i * escalatingPenalty;
    escalatingPenalty++;
  }

  return emptySeatPenalty;
};

export const calculateFitness = (tables: TableData[], guests: any[], maxTableSize: number): number => {
  let fitnessScore = 0;
  const maxTableLength = maxTableSize;

  // Constants
  const partialFamilyBonus = 10000;
  const fullFamilyBonus = 30000;
  const fullnessThreshold = 0.8;  // 80% full

  for (const table of tables) {
    const tableGuests = table.names.map(name => guests.find(guest => guest.attendee_name === name))
                          .filter(guest => guest !== undefined);

    const totalGuests = tableGuests.length;
    const tableFullness = totalGuests / maxTableLength;  // Calculate the fullness of the table

    // Apply downweight for empty seats with escalating penalty
    const emptySeats = maxTableLength - totalGuests;
    fitnessScore -= calculateEmptySeatPenalty(emptySeats);

    // Family and Friend counts
    const andrewFamilyCount = tableGuests.filter(guest => guest.relationship === "Family of Andrew Maddox").length;
    const andrewFriendCount = tableGuests.filter(guest => guest.relationship === "Friend of Andrew Maddox").length;
    const sophieFamilyCount = tableGuests.filter(guest => guest.relationship === "Family of Sophie Vellacott").length;
    const sophieFriendCount = tableGuests.filter(guest => guest.relationship === "Friend of Sophie Vellacott").length;

    // Full family table bonus, with the 80% fullness condition
    if ((andrewFamilyCount === totalGuests && sophieFamilyCount === 0) || 
        (sophieFamilyCount === totalGuests && andrewFamilyCount === 0)) {
      if (tableFullness >= fullnessThreshold) {
        fitnessScore += fullFamilyBonus;
      }
    }

    // Partial family table bonus
    if (andrewFamilyCount > 0 && andrewFamilyCount >= totalGuests / 2) {  
      fitnessScore += partialFamilyBonus;
    } else if (sophieFamilyCount > 0 && sophieFamilyCount >= totalGuests / 2) { 
      fitnessScore += partialFamilyBonus;
    }

    // Mixed family penalty
    if (andrewFamilyCount > 0 && sophieFamilyCount > 0) {
      fitnessScore -= 5000;
    }

    // Reward for mixed friends
    if (andrewFriendCount > 0 && sophieFriendCount > 0 && andrewFamilyCount === 0 && sophieFamilyCount === 0) {
      const totalFriends = andrewFriendCount + sophieFriendCount;
      const difference = Math.abs(andrewFriendCount - sophieFriendCount);

      const mixingScore = (totalFriends - difference) * 50;

      fitnessScore += mixingScore;
    }
  }

  return Number(fitnessScore.toFixed(1));
};
