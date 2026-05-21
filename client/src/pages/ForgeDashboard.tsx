import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForgeAuth } from "@/lib/useForgeAuth";
import { trpc } from "@/lib/trpc";
import {
  LogOut,
  BarChart3,
  Heart,
  MessageSquare,
  Zap,
  FileText,
  Settings,
  Sparkles,
  Activity,
  Image,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  Edit,
} from "lucide-react";

type Section =
  | "dashboard"
  | "prayers"
  | "testimonies"
  | "content"
  | "resources"
  | "sitecopy"
  | "autopilot"
  | "contentcreator"
  | "nurasessions"
  | "mediamanager";

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
    { id: "autopilot", label: "Autopilot", icon: Zap },
    { id: "contentcreator", label: "Content Creator", icon: Sparkles },
    { id: "nurasessions", label: "Nura Sessions", icon: Activity },
    { id: "mediamanager", label: "Media Manager", icon: Image },
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
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)] overflow-y-auto">
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
                  <span className="font-medium text-sm">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "prayers" && <PrayersSection />}
          {activeSection === "testimonies" && <TestimoniesSection />}
          {activeSection === "resources" && <ResourcesSection />}
          {activeSection === "content" && <ContentSection />}
          {activeSection === "sitecopy" && <SiteCopySection />}
          {activeSection === "autopilot" && <AutopilotSection />}
          {activeSection === "contentcreator" && <ContentCreatorSection />}
          {activeSection === "nurasessions" && <NuraSessionsSection />}
          {activeSection === "mediamanager" && <MediaManagerSection />}
        </main>
      </div>
    </div>
  );
}

function DashboardSection() {
  const prayersQuery = trpc.prayers.list.useQuery({} as any);
  const testimoniesQuery = trpc.testimonies.list.useQuery({} as any);

  const totalPrayers = prayersQuery.data?.length || 0;
  const pendingTestimonies = testimoniesQuery.data?.filter((t: any) => !t.approved).length || 0;

  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Prayers</h3>
          <p className="text-3xl font-bold">{totalPrayers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pending Testimonies</h3>
          <p className="text-3xl font-bold">{pendingTestimonies}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Crisis Alerts</h3>
          <p className="text-3xl font-bold text-destructive">—</p>
        </Card>
      </div>
      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Welcome to The Forge admin panel.</p>
          <p className="text-sm text-muted-foreground">Use the sidebar to manage prayers, testimonies, content, and more.</p>
        </div>
      </Card>
    </div>
  );
}

function PrayersSection() {
  const prayersQuery = trpc.prayers.list.useQuery({} as any);
  const deleteMutation = trpc.prayers.delete.useMutation();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id } as any,
      {
        onSuccess: () => {
          toast.success("Prayer deleted");
          prayersQuery.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Prayer Management</h2>
      <div className="space-y-4">
        {prayersQuery.isLoading && <p>Loading prayers...</p>}
        {prayersQuery.data?.map((prayer: any) => (
          <Card key={prayer.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{prayer.name || "Anonymous"}</h3>
                <p className="text-sm text-muted-foreground mt-1">{prayer.content}</p>
                {prayer.category && <span className="inline-block mt-2 px-2 py-1 bg-muted text-xs rounded">{prayer.category}</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(prayer.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TestimoniesSection() {
  const testimoniesQuery = trpc.testimonies.list.useQuery({} as any);
  const approveMutation = trpc.testimonies.approve.useMutation();
  const deleteMutation = trpc.testimonies.delete.useMutation();

  const handleApprove = (id: number) => {
    approveMutation.mutate(
      { id } as any,
      {
        onSuccess: () => {
          toast.success("Testimony approved");
          testimoniesQuery.refetch();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id } as any,
      {
        onSuccess: () => {
          toast.success("Testimony deleted");
          testimoniesQuery.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Testimony Management</h2>
      <div className="space-y-4">
        {testimoniesQuery.isLoading && <p>Loading testimonies...</p>}
        {testimoniesQuery.data?.map((testimony: any) => (
          <Card key={testimony.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{testimony.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{testimony.content}</p>
                <div className="mt-2 flex gap-2">
                  {!testimony.approved && (
                    <Button size="sm" onClick={() => handleApprove(testimony.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {testimony.approved && <span className="text-xs text-green-600">Approved</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(testimony.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResourcesSection() {
  const resourcesQuery = trpc.resources.list.useQuery({} as any);
  const [newResource, setNewResource] = useState({ name: "", phone: "", url: "", category: "" });
  const createMutation = trpc.resources.create.useMutation();
  const deleteMutation = trpc.resources.delete.useMutation();

  const handleCreate = () => {
    if (!newResource.name) {
      toast.error("Name is required");
      return;
    }
    createMutation.mutate(newResource as any, {
      onSuccess: () => {
        toast.success("Resource created");
        setNewResource({ name: "", phone: "", url: "", category: "" });
        resourcesQuery.refetch();
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id } as any,
      {
        onSuccess: () => {
          toast.success("Resource deleted");
          resourcesQuery.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Crisis Resources</h2>
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Add New Resource</h3>
        <div className="space-y-3">
          <Input placeholder="Resource name" value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} />
          <Input placeholder="Phone" value={newResource.phone} onChange={(e) => setNewResource({ ...newResource, phone: e.target.value })} />
          <Input placeholder="URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} />
          <Input placeholder="Category" value={newResource.category} onChange={(e) => setNewResource({ ...newResource, category: e.target.value })} />
          <Button onClick={handleCreate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </Card>
      <div className="space-y-4">
        {resourcesQuery.data?.map((resource: any) => (
          <Card key={resource.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{resource.name}</h3>
                {resource.phone && <p className="text-sm text-muted-foreground">{resource.phone}</p>}
                {resource.url && <p className="text-sm text-muted-foreground">{resource.url}</p>}
                {resource.category && <span className="inline-block mt-2 px-2 py-1 bg-muted text-xs rounded">{resource.category}</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(resource.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContentSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Content Library (The Armory)</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Content management interface for articles, posts, and announcements.</p>
      </Card>
    </div>
  );
}

function SiteCopySection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Site Copy Editor</h2>
      <Card className="p-6">
        <p className="text-muted-foreground">Edit all site headlines, body copy, and CTAs from here.</p>
      </Card>
    </div>
  );
}

function AutopilotSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Autopilot</h2>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Publisher Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">Auto-approve and post content to social media platforms.</p>
        <div className="flex gap-2">
          <Button variant="outline">Enable Autopilot</Button>
          <Button variant="outline">View Queue</Button>
        </div>
      </Card>
    </div>
  );
}

function ContentCreatorSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Content Creator</h2>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">AI Content Generation</h3>
        <p className="text-sm text-muted-foreground mb-4">Generate social posts and merch ideas on demand or on schedule.</p>
        <div className="flex gap-2">
          <Button>Generate Now</Button>
          <Button variant="outline">View Schedule</Button>
        </div>
      </Card>
    </div>
  );
}

function NuraSessionsSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Nura Sessions</h2>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Session Analytics</h3>
        <p className="text-sm text-muted-foreground">Monitor Nura chat sessions, crisis flags, and engagement metrics.</p>
      </Card>
    </div>
  );
}

function MediaManagerSection() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-bold mb-6">Media Manager</h2>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Upload & Manage Images</h3>
        <p className="text-sm text-muted-foreground mb-4">Upload images and manage background images for the site.</p>
        <Button>
          <Image className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </Card>
    </div>
  );
}
