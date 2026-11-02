import type { Doctor } from '../data/doctors';

export type Sort = 'az' | 'rating' | 'fav' | 'female' | 'male';

export function sortDoctors(list: Doctor[], sort: Sort, favoriteIds: string[] = []): Doctor[] {
  const az = (a: Doctor, b: Doctor) => a.name.localeCompare(b.name);
  switch (sort) {
    case 'rating':
      return [...list].sort((a, b) => b.rating - a.rating || az(a, b));
    case 'fav':
      return [...list].sort(
        (a, b) => Number(favoriteIds.includes(b.id)) - Number(favoriteIds.includes(a.id)) || az(a, b),
      );
    case 'female':
    case 'male':
      return list.filter((d) => d.gender === sort).sort(az);
    default:
      return [...list].sort(az);
  }
}

export const matchesQuery = (d: Doctor, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q);
};
