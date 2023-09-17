// tableUtils.ts

import { TableData } from "./seatingUtilities";
import { runGeneticAlgorithm } from './geneticAlgorithm';  // Import the main Genetic Algorithm function

export const createTableData = (
  guests: any[],
  sizeNormalTablesNumber: number,
  sizeTopTableNumber: number,
  topTableGuests: string[],
  numTopTableNumber: number,
  numNormalTableNumber: number
) => {
  console.log("Initial input parameters:", {
    guests,
    sizeNormalTablesNumber,
    sizeTopTableNumber,
    topTableGuests,
    numTopTableNumber,
    numNormalTableNumber,
  });

  let tables: TableData[] = [];

  const brideAndGroom = guests
    .filter((guest: any) => guest.is_bride || guest.is_groom)
    .map((guest: any) => guest.attendee_name);
  console.log("Bride and Groom:", brideAndGroom);

  // Create a Set to hold unique names for the top table
  const uniqueTopTableGuests = new Set([...topTableGuests, ...brideAndGroom]);
  console.log("Unique top table guests:", uniqueTopTableGuests);

  // Define remaining guests based on whether there are top tables or not
  let remainingGuests: any[];

  // If top tables are specified, add them manually to tables
  if (numTopTableNumber > 0) {
    tables.push({
      title: `Top Table ${numTopTableNumber}`,
      names: Array.from(uniqueTopTableGuests).slice(0, sizeTopTableNumber),
    });
    // Remove top table guests from the guest list
    remainingGuests = guests.filter(
      (guest: any) => !uniqueTopTableGuests.has(guest.attendee_name)
    );
  } else {
    // When no top table is specified, include topTableGuests in the normal table arrangement
    remainingGuests = guests;
  }
  const uniqueRelationships = new Set(guests.map((guest) => guest.relationship));

  // Generate the remaining tables using the Genetic Algorithm
  const optimizedRemainingGuestTables = runGeneticAlgorithm(
    remainingGuests,
    sizeNormalTablesNumber,
    numNormalTableNumber,
    uniqueRelationships
  );

  // Combine the top table(s) with the randomly generated tables
  const finaltables = [...tables, ...optimizedRemainingGuestTables];

  return finaltables;
};
