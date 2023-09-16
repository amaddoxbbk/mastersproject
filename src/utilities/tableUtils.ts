// Define the shape of the table data
interface TableData {
  title: string;
  names: string[];
}


export const createTableData = (
  guests: any[],
  sizeNormalTablesNumber: number,
  sizeTopTableNumber: number,
  topTableGuests: string[], // New argument for top table guests
  numTopTables: number
) => {
  let tables: TableData[] = [];
  let currentTable: string[] = [];
  let currentTableIndex = 1;

  console.log('All guests 1:', guests);


  // Find the bride and groom
  const brideAndGroom = guests.filter((guest: any) => guest.is_bride || guest.is_groom)
                              .map((guest: any) => guest.attendee_name);

  // Create a Set to hold unique names for the top table
  const uniqueTopTableGuests = new Set([...topTableGuests, ...(numTopTables > 0 ? brideAndGroom : [])]);

  // Conditionally add the selected top table guests to the tables array
  if (numTopTables > 0) {
    tables.push({
      title: "Top Table",
      names: Array.from(uniqueTopTableGuests),
    });
  } else {
    // If numTopTables is 0, check if adding the bride and groom would exceed the table size
    if (currentTable.length + brideAndGroom.length <= sizeNormalTablesNumber) {
      currentTable.push(...brideAndGroom);
      console.log('Added bride and groom to currentTable:', currentTable);  // Debugging line

    } else {
      // If it would, create a new table for them
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable],
      });
      currentTable = [...brideAndGroom];
      currentTableIndex++;
    }
  }

  // Populate the remaining normal tables
  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    if (!uniqueTopTableGuests.has(guest.attendee_name)) {
      currentTable.push(guest.attendee_name);
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable],
        });
        currentTable = [];
        currentTableIndex++;
      }
    }
  }

  // Add any remaining guests to the last table
  if (currentTable.length > 0) {
    tables.push({
      title: `Table ${currentTableIndex}`,
      names: [...currentTable],
    });
  }

  return tables;
};
