export type CategoryId =
  | "washers"
  | "fridges"
  | "acs"
  | "stoves"
  | "dishwashers"
  | "vacuums"
  | "heaters"
  | "tvs"
  | "small-appliances"
  | "bedroom"
  | "living"
  | "kitchen-tools"
  | "textiles"
  | "decor";

export type StoreId =
  | "jumia"
  | "noon"
  | "btech"
  | "twob"
  | "raneen"
  | "homzmart"
  | "ikea"
  | "carrefour"
  | "amazon"
  | "bfurn"
  | "raya"
  | "elaraby";

export type AffiliateNetwork =
  | "jumia"
  | "noon"
  | "arabclicks"
  | "direct";

export type Listing = {
  storeId: StoreId;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  shipping: string;
  url: string;
  sku: string;
  affiliateNetwork: AffiliateNetwork;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  barcode?: string;
  model: string;
  capacity?: string;
  specs: { label: string; value: string }[];
  highlights: string[];
  listings: Listing[];
  reviewHighlights: {
    author: string;
    text: string;
    rating: number;
    source: string;
  }[];
};

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  room: "kitchen" | "bedroom" | "living" | "general";
};

export type Store = {
  id: StoreId;
  name: string;
  city: string;
  specialty: string;
  affiliate: boolean;
  network: AffiliateNetwork;
  commissionNote: string;
};

export type Brand = {
  id: string;
  name: string;
  origin: string;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description: string;
  suggestedBudget: number;
  productIds: string[];
};

export type ListItem = {
  productId: string;
  qty: number;
  purchased: boolean;
  note: string;
};

export type PriceAlert = {
  productId: string;
  targetPrice: number;
};
