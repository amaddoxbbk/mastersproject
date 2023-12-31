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

export const calculateFitness = (tables: TableData[], guests: any[], maxTableSize: number, uniqueRelationships: Set<string>): number => {
  let fitnessScore = 0;
  const maxTableLength = maxTableSize;

  // Constants
  const partialFamilyBonus = 15000;
  const fullFamilyBonus = 30000;
  const fullnessThreshold = 0.8;  // 80% full - this is the threshold for a full family table bonus
  const mixedFamilyPenalty = 5000;
  const blacklistPenalty = -100000; // To prevent blacklisted guests from being seated together

  for (const table of tables) {
    const tableGuests = table.names.map(name => guests.find(guest => guest.attendee_name === name))
                          .filter(guest => guest !== undefined);
    
    const totalGuests = tableGuests.length;
    const tableFullness = totalGuests / maxTableLength;

    // Apply downweight for empty seats with escalating penalty
    const emptySeats = maxTableLength - totalGuests;
    fitnessScore -= calculateEmptySeatPenalty(emptySeats);

    const relationshipCounts: { [key: string]: number } = {};

    // Exclude null values from uniqueRelationships
    const filteredUniqueRelationships = Array.from(uniqueRelationships).filter(Boolean);

    for (const relation of filteredUniqueRelationships) {
        relationshipCounts[relation] = tableGuests.filter(guest => guest.relationship === relation).length;
    }

    // Checking the blacklist condition
    for (const guest of tableGuests) {
      if (Array.isArray(guest.blacklist_attendee_ids)) {
        for (const blacklistedId of guest.blacklist_attendee_ids) {
          if (tableGuests.some(otherGuest => otherGuest.attendee_id === blacklistedId)) {
            fitnessScore += blacklistPenalty;
          }
        }
      }
    }

    // Loop over each unique relationship to apply bonus or penalty
    for (const relation of filteredUniqueRelationships) {
      const count = relationshipCounts[relation];
      const [type, _, name] = relation.split(' ');

      // Full family table bonus, with the 80% fullness condition
      if (type === "Family" && count === totalGuests) {
        if (tableFullness >= fullnessThreshold) {
          fitnessScore += fullFamilyBonus;
        }
      }

      // Partial family table bonus
      if (type === "Family" && count > 0 && count >= totalGuests / 2) {
        fitnessScore += partialFamilyBonus;
      }

      // Mixed family penalty
      if (type === "Family" && count > 0 && Object.keys(relationshipCounts).some(otherRelation => {
        const [otherType, _, otherName] = otherRelation.split(' ');
        return otherType === "Family" && otherName !== name && relationshipCounts[otherRelation] > 0;
      })) {
        fitnessScore -= mixedFamilyPenalty;
      }

      // Reward for mixed friends
      if (type === "Friend" && count > 0 && Object.keys(relationshipCounts).some(otherRelation => {
        const [otherType, _, otherName] = otherRelation.split(' ');
        return otherType === "Friend" && otherName !== name && relationshipCounts[otherRelation] > 0;
      })) {
        const totalFriends = Object.keys(relationshipCounts).reduce((acc, otherRelation) => {
          const [otherType, _, otherName] = otherRelation.split(' ');
          if (otherType === "Friend" && otherName !== name) {
            acc += relationshipCounts[otherRelation];
          }
          return acc;
        }, 0);
        const difference = Math.abs(count - totalFriends);

        const mixingScore = (totalFriends - difference) * 50;
        fitnessScore += mixingScore;
      }
    }
  }

  return Number(fitnessScore.toFixed(1));
};
