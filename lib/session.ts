export type UserRole = "bride" | "groom" | "mother" | "planner";

export type BrideProfile = {
  id: string;
  firstName: string;
  lastName: string;
  groomName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  weddingDate: string;
  months: number;
  budget: number;
  finished: boolean;
  furnished: boolean;
  hasKitchen: boolean;
  hasAppliances: boolean;
  bedrooms: number;
  bathrooms: number;
  tier: "basic" | "smart" | "premium" | "full";
  role: UserRole;
  guests: string;
  notes: string;
};

export type StoredAccount = {
  profile: BrideProfile;
  password: string;
};

export const SESSION_KEY = "waffari-session-v1";
export const ACCOUNTS_KEY = "waffari-accounts-v1";

export const EGYPT_CITIES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "المنوفية",
  "البحيرة",
  "الغربية",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "دمياط",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "مطروح",
];

export const ROLE_LABEL: Record<UserRole, string> = {
  bride: "عروسة",
  groom: "عريس",
  mother: "ماما / أهل العروسة",
  planner: "منظّمة فرح",
};

export function emptyProfile(): BrideProfile {
  return {
    id: "",
    firstName: "",
    lastName: "",
    groomName: "",
    phone: "",
    email: "",
    city: "القاهرة",
    area: "",
    weddingDate: "",
    months: 6,
    budget: 150000,
    finished: false,
    furnished: false,
    hasKitchen: false,
    hasAppliances: false,
    bedrooms: 1,
    bathrooms: 1,
    tier: "smart",
    role: "bride",
    guests: "",
    notes: "",
  };
}

export function displayName(p: BrideProfile) {
  const n = `${p.firstName} ${p.lastName}`.trim();
  return n || "حسابي";
}
