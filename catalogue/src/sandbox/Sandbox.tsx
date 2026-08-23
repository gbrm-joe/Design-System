// The Sandbox — a working demo app built from the REAL shipped components.
//
// Why it exists: Project Manager shipped a page title 4px from the sidebar and
// nothing in the catalogue could have shown it. Tokens are drawn alone,
// components are drawn as specimens, and the Layout page is schematics at
// reduced scale — a schematic cannot show a 12px error, because none of its
// measurements are real. This can: a real screen, at real size, out of the
// real components, with awkward data in it.
//
// It imports from ../../../src — the WORKING COPY. Change a token, refresh,
// see it land in a screen rather than on a swatch. And because these are the
// components apps actually install, if the sandbox looks right the shipped
// thing IS right; a hand-reproduction can look perfect while the real
// component is wrong, which is the same class of bug as the one above.
//
// It takes the whole viewport on purpose. Rendered inside the catalogue's
// column it would sit under the catalogue's own h-12 header, so its nav would
// not reach the top and its title band would not sit level with its app name —
// it would misrepresent L2 while claiming to demonstrate it.
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Clock,
  TriangleAlert,
  Building2,
  Users,
  UserRound,
  ShieldCheck,
  CalendarDays,
  TrendingUp,
  Banknote,
  GitBranch,
  Award,
} from "lucide-react";
import {
  MainNav,
  PanelStackProvider,
  PanelStackRenderer,
  type MainNavGroup,
} from "../../../src";
import { SandboxLink, navigate, usePathname } from "./router";
import {
  SandboxControls,
  MeasureOverlay,
  type SandboxSettings,
  type DataState,
} from "./controls";
import ProjectsPage from "./pages/projects";
import TasksPage from "./pages/tasks";
import DashboardPage from "./pages/dashboard";
import PlaceholderPage from "./pages/placeholder";

// The nav a real manager app declares: groups, items, icons, Soon flags. No
// spacing — MainNav owns all of it (L8).
const GROUPS: MainNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Profitability", href: "/profitability", icon: TrendingUp },
      { label: "Cash flow", href: "/cash-flow", icon: Banknote },
      { label: "Pipeline", href: "/pipeline", icon: GitBranch },
      { label: "Bonuses", href: "/bonuses", icon: Award },
      { label: "Risk", href: "/risk", icon: TriangleAlert, soon: true },
    ],
  },
  {
    label: "Projects",
    items: [
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Tasks", href: "/tasks", icon: ListChecks },
      { label: "Timesheets", href: "/timesheets", icon: Clock },
      { label: "Incidents", href: "/incidents", icon: TriangleAlert, soon: true },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Organisations", href: "/organisations", icon: Building2 },
      { label: "Contacts", href: "/contacts", icon: UserRound },
      { label: "Key contacts", href: "/key-contacts", icon: UserRound, indent: true },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Staff", href: "/staff", icon: Users },
      { label: "Roles", href: "/roles", icon: ShieldCheck },
      { label: "Leave", href: "/leave", icon: CalendarDays },
      { label: "Teams", href: "/teams", icon: Users, soon: true },
    ],
  },
];

const TITLES: Record<string, string> = Object.fromEntries(
  GROUPS.flatMap((g) => g.items.map((i) => [i.href, i.label])),
);

export default function Sandbox({ onExit }: { onExit: () => void }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SandboxSettings>({
    measures: false,
    navCollapsed: false,
    brand: "#09090b",
    data: "full",
  });

  // The nav reads its colour from --sidebar-bg, exactly as an app's branding
  // sets it. Scoped to the document so the real SURFACE_NAV token resolves.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sidebar-bg", settings.brand);
    return () => {
      root.style.removeProperty("--sidebar-bg");
    };
  }, [settings.brand]);

  const set = (next: Partial<SandboxSettings>) =>
    setSettings((s) => ({ ...s, ...next }));

  return (
    <PanelStackProvider>
      {/* No z-index here on purpose. The panel stack sits at z-40+ and MUST
          paint over the app; a wrapper at z-50 put the whole shell above it
          and records opened invisibly. A real app has no such wrapper — the
          sandbox only needs one because it takes over the catalogue's page. */}
      <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
        <MainNav
          appName="Project Manager"
          appIcon={FolderKanban}
          groups={GROUPS}
          activePath={pathname}
          collapsed={settings.navCollapsed}
          onToggleCollapsed={() => set({ navCollapsed: !settings.navCollapsed })}
          linkAs={SandboxLink}
          user={{ name: "Joe Millson", subLine: "GBRM" }}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Route path={pathname} data={settings.data} />
        </main>
      </div>

      {/* The panel stack renders over everything — a record opens as the w-3/4
          Sheet with the nav still live behind it (L3). */}
      <PanelStackRenderer />
      <Toaster position="bottom-center" />

      {settings.measures && <MeasureOverlay />}
      <SandboxControls settings={settings} onChange={set} onExit={onExit} />
    </PanelStackProvider>
  );
}

function Route({ path, data }: { path: string; data: DataState }) {
  if (path === "/projects") return <ProjectsPage state={data} />;
  if (path === "/tasks") return <TasksPage state={data} />;
  if (path === "/dashboard") return <DashboardPage state={data} />;
  return <PlaceholderPage title={TITLES[path] ?? "Not found"} onGo={navigate} />;
}
