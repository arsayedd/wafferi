export type CategoryId =
  | "washers"
  | "fridges"
  | "freezers"
  | "acs"
  | "fans"
  | "stoves"
  | "dishwashers"
  | "vacuums"
  | "heaters"
  | "water"
  | "tvs"
  | "audio"
  | "small-appliances"
  | "personal-care"
  | "bedroom"
  | "living"
  | "kitchen-tools"
  | "textiles"
  | "decor"
  | "women-wear"
  | "men-wear"
  | "kids-wear"
  | "bridal-wear"
  | "pajamas"
  | "shoes"
  | "bags"
  | "jewelry"
  | "beauty"
  | "accessories"
  | "cleaning"
  | "bathroom"
  | "storage"
  | "travel"
  | "emergency"
  | "baby";

export type VerticalId =
  | "laundry"
  | "cooling"
  | "climate"
  | "cooking"
  | "cleaning"
  | "water_heat"
  | "av"
  | "small_kitchen"
  | "personal_care"
  | "furniture"
  | "textiles"
  | "decor"
  | "fashion_women"
  | "fashion_men"
  | "fashion_kids"
  | "bridal"
  | "sleepwear"
  | "shoes"
  | "bags"
  | "jewelry"
  | "beauty"
  | "accessories"
  | "bathroom"
  | "storage"
  | "travel"
  | "emergency"
  | "baby";

export type StoreKind =
  | "marketplace"
  | "electronics"
  | "hypermarket"
  | "brand"
  | "furniture"
  | "local"
  | "fashion"
  | "department"
  | "district"
  | "bridal"
  | "jewelry"
  | "beauty_retail";

export type ConnectorKind =
  | "affiliate_network"
  | "direct_affiliate"
  | "official_feed"
  | "brand_portal"
  | "partnership";

export type ConnectionStatus =
  | "connected"
  | "affiliate_ready"
  | "feed_pending"
  | "outreach";

export type AffiliateNetwork =
  | "jumia"
  | "noon"
  | "arabclicks"
  | "admitad"
  | "direct";

export type Store = {
  id: string;
  name: string;
  city: string;
  website: string;
  specialty: string;
  kind: StoreKind;
  connector: ConnectorKind;
  status: ConnectionStatus;
  network: AffiliateNetwork;
  commissionNote: string;
  verticals: VerticalId[];
  skuEstimate: number;
  affiliate: boolean;
};

export type Listing = {
  storeId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  shipping: string;
  url: string;
  sku: string;
  affiliateNetwork: AffiliateNetwork;
  coupon?: string;
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
  vertical: VerticalId;
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
  kind?: "room" | "bundle";
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
