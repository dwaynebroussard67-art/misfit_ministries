import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useForgeAuth } from "@/lib/useForgeAuth";

export default function ForgeLogin() {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useForgeAuth();
  const [, setLocation] = useLocation();
  const authenticate = trpc.forge.authenticate.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      toast.error("Please enter the passphrase");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticate.mutateAsync({ passphrase });
      login(response.token, response.expiresAt);
      toast.success("Welcome to The Forge");
      setLocation("/forge/dashboard");
    } catch (error) {
      toast.error("Invalid passphrase");
      setPassphrase("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">The Forge</h1>
            <p className="text-muted-foreground">Admin CMS for Misfit Ministries</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Passphrase</label>
              <Input
                type="password"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Authenticating..." : "Enter The Forge"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            The Forge is the admin control center for Misfit Ministries.
          </p>
        </Card>
      </div>
    </div>
  );
}
