// SeatingUtilities.ts

export interface TableData {
    title: string;
    names: string[];
  }
  
  export const generateRandomTable = (
    guests: any[],
    sizeNormalTablesNumber: number
  ): TableData[] => {
    console.log("Original guest list:", guests);
  
    let tables: TableData[] = [];
    let currentTable: string[] = [];
    let currentTableIndex = 1;
  
    // Group guests with their partners
    const groupedGuests: any[] = [];
    const singleGuests: any[] = [];
  
    for (const guest of guests) {
      if (guest.partner_to !== null) {
        const mainGuest = guests.find(g => g.attendee_id === guest.partner_to);
        if (mainGuest) {
          groupedGuests.push([mainGuest, guest]);
        }
      } else if (!guests.some(g => g.partner_to === guest.attendee_id)) {
        singleGuests.push(guest);
      }
    }
  
    console.log("Grouped guests:", groupedGuests);
    console.log("Single guests:", singleGuests);
  
    // Shuffle the guests to randomize the seating
    const shuffledGuests = [...groupedGuests, ...singleGuests].sort(() => Math.random() - 0.5);
  
    console.log("Shuffled guests:", shuffledGuests);
  
    for (const guestOrGroup of shuffledGuests) {
      if (Array.isArray(guestOrGroup)) {
        // It's a group
        if (currentTable.length <= sizeNormalTablesNumber - 2) {
          currentTable.push(guestOrGroup[0].attendee_name, guestOrGroup[1].attendee_name);
          console.log(`Adding ${guestOrGroup[0].attendee_name} and ${guestOrGroup[1].attendee_name} to the current table.`);
        } else {
          tables.push({
            title: `Table ${currentTableIndex}`,
            names: [...currentTable]
          });
          console.log(`Closing Table ${currentTableIndex} with names: ${currentTable}`);
          currentTable = [guestOrGroup[0].attendee_name, guestOrGroup[1].attendee_name];
          console.log(`Starting a new table with ${guestOrGroup[0].attendee_name} and ${guestOrGroup[1].attendee_name}`);
          currentTableIndex++;
        }
      } else {
        // It's a single
        currentTable.push(guestOrGroup.attendee_name);
        console.log(`Adding ${guestOrGroup.attendee_name} to the current table.`);
      }
  
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable]
        });
        console.log(`Closing Table ${currentTableIndex} with names: ${currentTable}`);
        currentTable = [];
        currentTableIndex++;
      }
    }
  
    // Add any remaining guests to the last table
    if (currentTable.length > 0) {
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable]
      });
      console.log(`Closing Table ${currentTableIndex} with remaining names: ${currentTable}`);
    }
  
    console.log("Final tables:", tables);
    return tables;
  };
  