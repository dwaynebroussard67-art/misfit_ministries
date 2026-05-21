import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function Prayer() {
  const copy = useSiteCopy();
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [category, setCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: prayers, refetch } = trpc.prayers.list.useQuery({} as any);
  const createPrayer = trpc.prayers.create.useMutation();
  const incrementPrayer = trpc.prayers.incrementPrayerCount.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) {
      toast.error("Please enter a prayer request");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPrayer.mutateAsync({
        name: isAnonymous ? undefined : name,
        request,
        category,
        isAnonymous,
      });
      toast.success("Your prayer has been submitted. Jesus hears.");
      setName("");
      setRequest("");
      setCategory("general");
      setIsAnonymous(false);
      refetch();
    } catch (error) {
      toast.error("Failed to submit prayer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrayed = async (id: number) => {
    try {
      await incrementPrayer.mutateAsync({ id });
      refetch();
    } catch (error) {
      toast.error("Failed to update prayer count");
    }
  };

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("prayer.headline")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {copy("prayer.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-serif text-2xl font-bold mb-4">Submit a Prayer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      placeholder="Name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isAnonymous || isSubmitting}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
                      {copy("prayer.anonymous")}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option value="general">General</option>
                      <option value="healing">Healing</option>
                      <option value="recovery">Recovery</option>
                      <option value="crisis">Crisis</option>
                      <option value="family">Family</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Prayer Request</label>
                    <Textarea
                      placeholder="What's on your heart?"
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      disabled={isSubmitting}
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Submitting..." : copy("prayer.submit")}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-4">
                {prayers && prayers.length > 0 ? (
                  prayers.map((prayer: any) => (
                    <Card key={prayer.id} className="p-6 hover:bg-card/80 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {prayer.isAnonymous ? "Anonymous" : prayer.name || "Prayer Request"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {prayer.category && (
                              <span className="inline-block px-2 py-1 rounded bg-accent/20 text-accent-foreground mr-2">
                                {prayer.category}
                              </span>
                            )}
                            {new Date(prayer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground mb-4 line-clamp-3">{prayer.request}</p>
                      <button
                        onClick={() => handlePrayed(prayer.id)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{copy("prayer.prayed")} ({prayer.prayerCount || 0})</span>
                      </button>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center text-muted-foreground">
                    No prayers yet. Be the first to submit one.
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
