import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { Link } from "wouter";

export default function About() {
  const copy = useSiteCopy();

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold text-accent mb-4 uppercase tracking-widest">
              About Us
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("about.headline1")}
            </h1>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-accent">
              {copy("about.headline2")}
            </h2>
            <p className="text-xl text-muted-foreground italic">
              {copy("about.intro")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="p-8 md:p-12 border-accent/30">
              <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">
                {copy("about.who.headline")}
              </h3>
              <ul className="space-y-4 mb-6">
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground">
                    {copy("about.who.body1")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground">
                    {copy("about.who.body2")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground">
                    {copy("about.who.body3")}
                  </p>
                </li>
              </ul>
              <p className="text-xl font-semibold text-accent">
                {copy("about.who.highlight")}
              </p>
            </Card>

            <Card className="p-8 md:p-12 border-accent/30">
              <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">
                {copy("about.theology.headline")}
              </h3>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  {copy("about.theology.body1")}
                </p>
                <p className="text-lg text-muted-foreground">
                  {copy("about.theology.body2")}
                </p>
                <p className="text-lg text-muted-foreground">
                  {copy("about.theology.body3")}
                </p>
                <p className="text-lg text-muted-foreground">
                  {copy("about.theology.body4")}
                </p>
              </div>
            </Card>

            <Card className="p-8 md:p-12 bg-card border-accent/30">
              <h3 className="font-serif text-3xl font-bold mb-4 text-foreground">
                {copy("about.mission.headline1")}
              </h3>
              <h4 className="font-serif text-2xl font-bold mb-6 text-accent">
                {copy("about.mission.headline2")}
              </h4>
              <p className="text-xl font-semibold text-accent mb-8">
                {copy("about.mission.tagline")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nura">
                  <Button size="lg">Chat with Nura</Button>
                </Link>
                <Link href="/prayer">
                  <Button size="lg" variant="outline">
                    Submit a Prayer
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
