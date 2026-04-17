import type { ProductSpecs, CategorySlug } from "@/types";

const SPEC_LABELS: Record<keyof ProductSpecs, string> = {
  brand: "برند",
  model: "مدل",
  color: "رنگ",
  warranty: "گارانتی",
  weight: "وزن",
  dimensions: "ابعاد",
  screenSize: "اندازه صفحه نمایش",
  processor: "پردازنده",
  ram: "رم",
  storage: "حافظه داخلی",
  battery: "باتری",
  camera: "دوربین",
  os: "سیستم عامل",
  connectionType: "نوع اتصال",
  driverSize: "اندازه درایور",
  frequency: "پاسخ فرکانسی",
  impedance: "امپدانس",
  material: "جنس",
};

const CATEGORY_FIELDS: Record<CategorySlug, (keyof ProductSpecs)[]> = {
  mobiles: [
    "brand",
    "model",
    "color",
    "warranty",
    "weight",
    "dimensions",
    "screenSize",
    "processor",
    "ram",
    "storage",
    "battery",
    "camera",
    "os",
  ],
  laptops: [
    "brand",
    "model",
    "color",
    "warranty",
    "weight",
    "dimensions",
    "screenSize",
    "processor",
    "ram",
    "storage",
    "battery",
    "os",
  ],
  tablets: [
    "brand",
    "model",
    "color",
    "warranty",
    "weight",
    "dimensions",
    "screenSize",
    "processor",
    "ram",
    "storage",
    "battery",
    "os",
  ],
  headphones: [
    "brand",
    "model",
    "color",
    "warranty",
    "weight",
    "connectionType",
    "driverSize",
    "frequency",
    "impedance",
  ],
  accessories: [
    "brand",
    "model",
    "color",
    "warranty",
    "weight",
    "dimensions",
    "material",
    "connectionType",
  ],
};

export default function SpecsTable({
  specs,
  categorySlug,
}: {
  specs: ProductSpecs;
  categorySlug: CategorySlug;
}) {
  const fields =
    CATEGORY_FIELDS[categorySlug] ??
    (Object.keys(SPEC_LABELS) as (keyof ProductSpecs)[]);

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-card-hover">
            <th className="text-right px-4 py-3 font-semibold text-fg-primary w-1/3">
              ویژگی
            </th>
            <th className="text-right px-4 py-3 font-semibold text-fg-primary">
              مقدار
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((key, i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? "bg-bg-card" : "bg-bg-card-hover/50"}
            >
              <td className="px-4 py-2.5 text-fg-secondary">
                {SPEC_LABELS[key]}
              </td>
              <td className="px-4 py-2.5 text-fg-primary">
                {specs[key] ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
