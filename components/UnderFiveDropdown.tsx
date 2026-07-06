"use client";

import { useRouter } from "next/navigation";

interface Filter {
  label: string;
  key: string;
}

interface UnderFiveDropdownProps {
  filters: Filter[];
  currentKeyword: string;
  currentSort: string;
}

export default function UnderFiveDropdown({ filters, currentKeyword, currentSort }: UnderFiveDropdownProps) {
  const router = useRouter();

  return (
    <select
      id="cat-dropdown"
      value={currentKeyword}
      onChange={(e) => {
        const val = e.target.value; // 💎 FIXED: encodeURIComponent hata diya taake double encoding na ho
        // Next.js standard client router handling spaces natively
        router.push(`/under-5-shop?cat=${val}&sort=${currentSort}`);
      }}
      className="w-full bg-white text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer shadow-sm"
    >
      {filters.map((f) => (
        <option key={f.label} value={f.key}>
          {f.label}
        </option>
      ))}
    </select>
  );
}
