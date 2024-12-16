export interface MembershipPlan {
  id: number;
  level: number;
  name: string;
  price: number;
  image?: string;
  benefits: string[];
  accumulatedBenefits: string[];
  is_active: boolean;
}