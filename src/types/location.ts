export interface Location {
  businessId: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  formattedAddress: string | null;
}
