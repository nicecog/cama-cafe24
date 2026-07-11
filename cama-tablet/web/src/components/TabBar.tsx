import type { DashboardTab } from "../types/healthData";

type Tab = { id: DashboardTab; label: string; badge?: number };

type Props = {
  tabs: Tab[];
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
};

export default function TabBar({ tabs, active, onChange }: Props) {
  return (
    <nav className="dashboard-tabs" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`dashboard-tab${isActive ? " dashboard-tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="dashboard-tab-badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
