import type { Contractor, MaintenanceRequest, Property } from "./types";

export interface ProviderScore {
  contractor: Contractor;
  score: number;
  breakdown: { category: number; location: number; rating: number; cost: number };
}

export function scoreProviders(
  request: MaintenanceRequest,
  property: Property | undefined,
  contractors: Contractor[]
): ProviderScore[] {
  const maxRate = Math.max(...contractors.map(c => c.hourlyRate), 1);

  const scored = contractors.map(c => {
    const categoryScore = c.specializations
      .map(s => s.toLowerCase())
      .includes(request.category.toLowerCase()) ? 40 : 0;

    const locationScore = property && c.city === property.city ? 30 : 15;

    const ratingScore = Math.round((Math.min(c.rating, 5) / 5) * 20);

    const costScore = Math.round((1 - c.hourlyRate / maxRate) * 10);

    const score = categoryScore + locationScore + ratingScore + costScore;
    return {
      contractor: c,
      score,
      breakdown: { category: categoryScore, location: locationScore, rating: ratingScore, cost: costScore }
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
