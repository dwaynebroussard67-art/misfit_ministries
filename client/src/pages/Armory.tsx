import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Armory() {
  const copy = useSiteCopy();
  const { data: content } = trpc.content.list.useQuery({ published: true });

  const posts = content?.filter((item: any) => item.type === "post") || [];
  const announcements = content?.filter((item: any) => item.type === "announcement") || [];

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("armory.headline")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {copy("armory.body")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {announcements.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6 text-accent">
                  Announcements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((item: any) => (
                    <Card key={item.id} className="p-6 hover:bg-card/80 transition-colors">
                      <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.excerpt}
                        </p>
                      )}
                      <Link href={`/armory/${item.slug}`}>
                        <a className="text-sm font-semibold text-accent hover:text-accent-foreground transition-colors">
                          Read More →
                        </a>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {posts.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                  Articles & Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((item: any) => (
                    <Card key={item.id} className="p-6 hover:bg-card/80 transition-colors">
                      <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.excerpt}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mb-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <Link href={`/armory/${item.slug}`}>
                        <a className="text-sm font-semibold text-accent hover:text-accent-foreground transition-colors">
                          Read More →
                        </a>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {posts.length === 0 && announcements.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground">
                <p>No content yet. Check back soon.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
