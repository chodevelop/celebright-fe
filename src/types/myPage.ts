export interface Follow {
    id: number;
    User: {
      username: string;
      profile_image?: string;
    };
    category?: string;
  }
  
  export interface Subscription {
    influencerId: number;
    productName: string;
    productId: number;
    price: number;
    benefits: string[];
  }
  