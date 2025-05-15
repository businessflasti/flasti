// Archivo principal que importa todos los usuarios de los diferentes países

import { FomoUser } from './fomo-users-types';
import { argentinaUsers } from './fomo-users-argentina';
import { colombiaUsers } from './fomo-users-colombia';
import { mexicoUsers } from './fomo-users-mexico';
import { peruUsers } from './fomo-users-peru';
import { espanaUsers } from './fomo-users-espana';
import { chileUsers } from './fomo-users-chile';
import { venezuelaUsers } from './fomo-users-venezuela';
import { ecuadorUsers } from './fomo-users-ecuador';
import { usaUsers } from './fomo-users-usa';
import { brasilUsers } from './fomo-users-brasil';

// Mapa de usuarios por código de país
export const usersByCountry: Record<string, FomoUser[]> = {
  'AR': argentinaUsers,
  'CO': colombiaUsers,
  'MX': mexicoUsers,
  'PE': peruUsers,
  'ES': espanaUsers,
  'CL': chileUsers,
  'VE': venezuelaUsers,
  'EC': ecuadorUsers,
  'US': usaUsers,
  'BR': brasilUsers,
};

// Función para obtener usuarios aleatorios por país
export const getUsersByCountry = (countryCode: string): FomoUser[] => {
  return usersByCountry[countryCode] || [];
};

// Función para obtener un usuario aleatorio de un país específico
export const getRandomUserByCountry = (countryCode: string): FomoUser | null => {
  const countryUsers = getUsersByCountry(countryCode);
  if (countryUsers.length === 0) return null;
  return countryUsers[Math.floor(Math.random() * countryUsers.length)];
};

// Función para obtener un usuario aleatorio de cualquier país
export const getRandomUser = (): FomoUser => {
  // Obtener todos los usuarios
  const allUsers = Object.values(usersByCountry).flat();
  return allUsers[Math.floor(Math.random() * allUsers.length)];
};
