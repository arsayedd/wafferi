export type StrategyType = "schema_org" | "css" | "regex" | "json";

export type FieldStrategy = {
  type: StrategyType;
  value?: string;
};

export type HostRecipe = {
  host: string;
  title?: FieldStrategy;
  price?: FieldStrategy;
  availability?: FieldStrategy;
};

export const bundledRecipes: HostRecipe[] = [
  { host: "jumia.com.eg", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "noon.com", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "amazon.eg", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "btech.com", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "2b.com.eg", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "ikea.com", title: { type: "schema_org" }, price: { type: "schema_org" } },
  { host: "homzmart.com", title: { type: "schema_org" }, price: { type: "schema_org" } },
];

export function recipeForHost(host: string, extra: HostRecipe[] = []): HostRecipe | undefined {
  const h = host.replace(/^www\./, "").toLowerCase();
  const all = [...extra, ...bundledRecipes];
  return all.find((r) => h === r.host || h.endsWith(r.host));
}
