// Tipos para los datos de usuarios de notificaciones FOMO

export interface FomoUser {
  firstName: string;
  lastName: string;
  city: string;
  region: string; // Provincia, estado o departamento
  country: string;
  countryCode: string;
  flag: string;
}
