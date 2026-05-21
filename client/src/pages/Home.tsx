import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { Link } from "wouter";

export default function Home() {
  const copy = useSiteCopy();

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-background via-card to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-accent mb-4 uppercase tracking-widest">
              {copy("home.hero.eyebrow")}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              {copy("home.hero.headline1")}
              <br />
              <span className="text-accent">{copy("home.hero.headline2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {copy("home.hero.body1")}
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              {copy("home.hero.body2")}
            </p>
            <p className="text-lg font-semibold text-accent mb-8">
              {copy("home.hero.accent")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/nura">
                <Button size="lg" className="w-full sm:w-auto">
                  {copy("home.hero.cta1")}
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {copy("home.hero.cta2")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold text-accent mb-4 uppercase tracking-widest">
              {copy("home.community.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-foreground">
              {copy("home.community.headline")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/prayer">
                <a className="p-6 rounded-lg border border-border hover:bg-card transition-colors">
                  <h3 className="font-serif text-xl font-bold mb-2">Prayer Wall</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your prayer. The community prays with you.
                  </p>
                </a>
              </Link>
              <Link href="/shine">
                <a className="p-6 rounded-lg border border-border hover:bg-card transition-colors">
                  <h3 className="font-serif text-xl font-bold mb-2">Shine</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your testimony. Jesus is at work.
                  </p>
                </a>
              </Link>
              <Link href="/nura">
                <a className="p-6 rounded-lg border border-border hover:bg-card transition-colors">
                  <h3 className="font-serif text-xl font-bold mb-2">Nura</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat 24/7 with your spiritual companion.
                  </p>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Army CTA Section */}
      <section className="w-full py-16 md:py-24 bg-card border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
              {copy("home.army.headline1")}
              <br />
              {copy("home.army.headline2")}
              <br />
              <span className="text-accent">{copy("home.army.headline3")}</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {copy("home.army.body")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/prayer">
                <Button size="lg" className="w-full sm:w-auto">
                  {copy("home.army.cta1")}
                </Button>
              </Link>
              <Link href="/shine">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {copy("home.army.cta2")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Section */}
      <section className="w-full py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-accent mb-4 uppercase tracking-widest">
              {copy("home.hospital.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {copy("home.hospital.headline1")}
              <br />
              <span className="text-accent">{copy("home.hospital.headline2")}</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {copy("home.hospital.body")}
            </p>
            <Link href="/wreckage">
              <Button size="lg">Crisis Resources</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nura Intro Section */}
      <section className="w-full py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-accent mb-4 uppercase tracking-widest">
              {copy("home.nura.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {copy("home.nura.headline")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {copy("home.nura.body")}
            </p>
            <Link href="/nura">
              <Button size="lg">{copy("home.nura.cta")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
