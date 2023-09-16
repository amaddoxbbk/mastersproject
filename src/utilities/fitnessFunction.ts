import { TableData } from './seatingUtilities';

export const calculateFitness = (tables: TableData[], guests: any[]): number => {
    let fitnessScore = 0;

    for (const table of tables) {
        const tableGuests = table.names.map(name => guests.find(guest => guest.attendee_name === name));
        
        const totalGuests = tableGuests.length;

        const andrewFamilyCount = tableGuests.filter(guest => guest.relationship === "Family of Andrew Maddox").length;
        const andrewFriendCount = tableGuests.filter(guest => guest.relationship === "Friend of Andrew Maddox").length;
        const sophieFamilyCount = tableGuests.filter(guest => guest.relationship === "Family of Sophie Vellacott").length;
        const sophieFriendCount = tableGuests.filter(guest => guest.relationship === "Friend of Sophie Vellacott").length;
        
        // Scoring for how close the table is to being only one family
        if (andrewFamilyCount > 0 || sophieFamilyCount > 0) {
            const andrewFamilyRatio = andrewFamilyCount / totalGuests;
            const sophieFamilyRatio = sophieFamilyCount / totalGuests;

            fitnessScore += (andrewFamilyRatio * 20);
            fitnessScore += (sophieFamilyRatio * 20);
        }

        // Both families mixed
        if (andrewFamilyCount > 0 && sophieFamilyCount > 0) {
            fitnessScore -= 10;
        }
        
        // Only friends and they are mixed
        if (andrewFriendCount > 0 && sophieFriendCount > 0 && andrewFamilyCount === 0 && sophieFamilyCount === 0) {
            fitnessScore += 5;
        }
    }

    return fitnessScore;
};
