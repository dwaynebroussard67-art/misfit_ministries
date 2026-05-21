import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Shine() {
  const copy = useSiteCopy();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: testimonies, refetch } = trpc.testimonies.list.useQuery({ approved: true } as any);
  const createTestimony = trpc.testimonies.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) {
      toast.error("Please share your story");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTestimony.mutateAsync({
        name: name || undefined,
        title: title || undefined,
        story,
      });
      toast.success("Your testimony has been submitted and is awaiting approval.");
      setName("");
      setTitle("");
      setStory("");
      await refetch();
    } catch (error) {
      toast.error("Failed to submit testimony");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("shine.headline")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {copy("shine.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-serif text-2xl font-bold mb-4">Share Your Story</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name (optional)</label>
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Story Title (optional)</label>
                    <Input
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Story</label>
                    <Textarea
                      placeholder="Share your testimony. How has Jesus worked in your life?"
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      disabled={isSubmitting}
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Submitting..." : copy("shine.submit")}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-4">
                {testimonies && testimonies.length > 0 ? (
                  testimonies.map((testimony: any) => (
                    <Card key={testimony.id} className="p-6 hover:bg-card/80 transition-colors">
                      {testimony.title && (
                        <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
                          {testimony.title}
                        </h3>
                      )}
                      {testimony.name && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {testimony.name}
                        </p>
                      )}
                      <p className="text-foreground leading-relaxed">{testimony.story}</p>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center text-muted-foreground">
                    No testimonies yet. Be the first to share your story.
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
