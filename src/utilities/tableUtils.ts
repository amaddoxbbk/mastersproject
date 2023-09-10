// Define the shape of the table data
interface TableData {
  title: string;
  names: string[];
}

export const createTableData = (
  guests: any[],
  sizeNormalTablesNumber: number,
  sizeTopTableNumber: number,
  topTableGuests: string[] // New argument for top table guests
) => {
  let tables: TableData[] = [];
  let currentTable: string[] = [];
  let currentTableIndex = 1;

  // Add the selected top table guests to the tables array
  if (topTableGuests.length > 0) {
    tables.push({
      title: "Top Table",
      names: topTableGuests,
    });
  }

  // Populate the remaining normal tables
  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    if (!topTableGuests.includes(guest.attendee_name)) {
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
