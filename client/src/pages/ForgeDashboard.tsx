import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useForgeAuth } from "@/lib/useForgeAuth";
import { LogOut, BarChart3, Heart, MessageSquare, Zap, FileText, Settings } from "lucide-react";

type Section = "dashboard" | "prayers" | "testimonies" | "content" | "resources" | "sitecopy" | "analytics";

export default function ForgeDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const { logout } = useForgeAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out from The Forge");
    setLocation("/forge");
  };

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "prayers", label: "Prayers", icon: Heart },
    { id: "testimonies", label: "Testimonies", icon: MessageSquare },
    { id: "resources", label: "Resources", icon: Zap },
    { id: "content", label: "Content", icon: FileText },
    { id: "sitecopy", label: "Site Copy", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">The Forge</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "prayers" && <PrayersSection />}
          {activeSection === "testimonies" && <TestimoniesSection />}
          {activeSection === "resources" && <ResourcesSection />}
          {activeSection === "content" && <ContentSection />}
          {activeSection === "sitecopy" && <SiteCopySection />}
        </main>
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Prayers</h3>
          <p className="text-3xl font-bold">—</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pending Testimonies</h3>
          <p className="text-3xl font-bold">—</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Crisis Alerts</h3>
          <p className="text-3xl font-bold text-destructive">—</p>
        </Card>
      </div>
      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <p className="text-muted-foreground">Dashboard features coming soon.</p>
      </Card>
    </div>
  );
}

function PrayersSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Prayer Management</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Prayer management interface coming soon.</p>
      </Card>
    </div>
  );
}

function TestimoniesSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Testimony Management</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Testimony management interface coming soon.</p>
      </Card>
    </div>
  );
}

function ResourcesSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Crisis Resources</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Resource management interface coming soon.</p>
      </Card>
    </div>
  );
}

function ContentSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Content Library (The Armory)</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Content management interface coming soon.</p>
      </Card>
    </div>
  );
}

function SiteCopySection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Site Copy Editor</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Site copy editor interface coming soon.</p>
      </Card>
    </div>
  );
}
