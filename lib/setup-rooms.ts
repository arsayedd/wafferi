import type { CategoryId } from "./types";
import { templates } from "./catalog";

export type SetupSlot = {
  label: string;
  category: CategoryId;
};

export type RoomBlueprint = {
  id: string;
  title: string;
  blurb: string;
  slots: SetupSlot[];
  templateId?: string;
};

export const roomBlueprints: RoomBlueprint[] = [
  {
    id: "kitchen",
    title: "تجهيز المطبخ",
    blurb: "أجهزة كبيرة + صغيرة + حلل.",
    templateId: "kitchen-plus",
    slots: [
      { label: "ثلاجة", category: "fridges" },
      { label: "غسالة", category: "washers" },
      { label: "غسالة أطباق", category: "dishwashers" },
      { label: "بوتاجاز", category: "stoves" },
      { label: "أجهزة صغيرة", category: "small-appliances" },
      { label: "حلل وأدوات", category: "kitchen-tools" },
      { label: "سخان", category: "heaters" },
    ],
  },
  {
    id: "appliances",
    title: "أجهزة الشقة",
    blurb: "شاشة، تكييف، مكنسة.",
    templateId: "cooling",
    slots: [
      { label: "شاشة", category: "tvs" },
      { label: "تكييف", category: "acs" },
      { label: "مكنسة", category: "vacuums" },
      { label: "سخان", category: "heaters" },
    ],
  },
  {
    id: "textiles",
    title: "المفروشات",
    blurb: "لحاف وفوط وستائر.",
    templateId: "bedroom-set",
    slots: [{ label: "مفروشات", category: "textiles" }],
  },
  {
    id: "bedroom",
    title: "غرفة النوم",
    blurb: "غرفة + مفروشات.",
    templateId: "bedroom-set",
    slots: [
      { label: "غرفة نوم", category: "bedroom" },
      { label: "مفروشات", category: "textiles" },
    ],
  },
  {
    id: "living",
    title: "غرفة المعيشة",
    blurb: "صالون وسفرة وشاشة.",
    templateId: "living-set",
    slots: [
      { label: "صالون", category: "living" },
      { label: "شاشة", category: "tvs" },
    ],
  },
  {
    id: "bathroom",
    title: "الحمام",
    blurb: "فوط ومستلزمات.",
    slots: [{ label: "الحمام", category: "bathroom" }],
  },
];

export function blueprintByTemplate(templateId: string) {
  return roomBlueprints.find((b) => b.templateId === templateId) ?? templates.find((t) => t.id === templateId);
}
