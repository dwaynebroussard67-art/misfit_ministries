import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { Phone, Globe, Clock } from "lucide-react";

export default function Wreckage() {
  const copy = useSiteCopy();
  const { data: resources } = trpc.resources.list.useQuery({} as any);

  const categories = [
    { id: "crisis", label: "Crisis" },
    { id: "mental-health", label: "Mental Health" },
    { id: "addiction", label: "Addiction" },
    { id: "housing", label: "Housing" },
    { id: "legal", label: "Legal" },
    { id: "other", label: "Other" },
  ];

  const groupedResources = resources?.reduce((acc: Record<string, any>, resource: any) => {
    const cat = resource.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(resource);
    return acc;
  }, {} as Record<string, any>);

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("wreckage.headline")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {copy("wreckage.body")}
            </p>

            <Card className="p-8 bg-destructive/10 border-destructive/50 mb-8">
              <p className="text-sm font-semibold text-destructive uppercase mb-2">Always Available</p>
              <h2 className="font-serif text-4xl font-bold text-destructive mb-2">
                {copy("wreckage.988")}
              </h2>
              <p className="text-lg text-destructive/80 mb-4">Call or text 988</p>
              <p className="text-sm text-destructive/70">
                24/7 crisis support. Free and confidential.
              </p>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {categories.map((category) => {
              const categoryResources = groupedResources?.[category.id] || [];
              if (categoryResources.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                    {category.label}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryResources.map((resource: any) => (
                      <Card key={resource.id} className="p-6 hover:bg-card/80 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-foreground">
                            {resource.title}
                          </h3>
                          {resource.available247 && (
                            <div className="flex items-center gap-1 text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                              <Clock className="w-3 h-3" />
                              24/7
                            </div>
                          )}
                        </div>

                        {resource.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {resource.description}
                          </p>
                        )}

                        <div className="space-y-2">
                          {resource.phone && (
                            <a
                              href={`tel:${resource.phone}`}
                              className="flex items-center gap-2 text-sm text-accent hover:text-accent-foreground transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              {resource.phone}
                            </a>
                          )}
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-accent hover:text-accent-foreground transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                              Visit Website
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
