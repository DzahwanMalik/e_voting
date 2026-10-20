import Tab from "@/components/atoms/Tab";
import type { TabListProps } from "./TabList.types";

const TabList = <TValue extends string | number>({
  items,
  value,
  onChange,
  ariaLabel = "Filter",
  className = "",
}: TabListProps<TValue>) => {
  if (items.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex items-center gap-2 overflow-x-auto scrollbar-none p-1.5 -m-1.5 ${className}`.trim()}
    >
      {items.map((item) => (
        <Tab
          key={String(item.value)}
          isActive={item.value === value}
          count={item.count}
          icon={item.icon}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Tab>
      ))}
    </div>
  );
};

export default TabList;
