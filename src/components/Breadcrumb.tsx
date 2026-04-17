import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-fg-secondary">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronLeft size={14} className="text-fg-muted" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-accent-text transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-fg-primary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
