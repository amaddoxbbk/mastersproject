interface Guest {
    attendee_name: string;
    attendee_id: string;
    partner_to?: string;
  }
  
  export function createBiDirectionalPartnerMapping(initialGuests: Guest[]): { [key: string]: string | null } {
    const biDirectionalPartnerMapping: { [key: string]: string | null } = {};
  
    initialGuests.forEach((guest) => {
      const partner = initialGuests.find((g) => g.attendee_id === guest.partner_to);
  
      // Add the mapping from this guest to their partner
      biDirectionalPartnerMapping[guest.attendee_name] = partner ? partner.attendee_name : null;
  
      // Add the reverse mapping from the partner to this guest
      if (partner) {
        biDirectionalPartnerMapping[partner.attendee_name] = guest.attendee_name;
      }
    });
  
    return biDirectionalPartnerMapping;
  }
  