import { useMemo } from "react";
import { trpc } from "./trpc";

const DEFAULT_SITE_COPY = {
  "home.hero.eyebrow": "Welcome to Misfit Ministries",
  "home.hero.headline1": "A Hospital for the Broken",
  "home.hero.headline2": "A Beacon for Humanity",
  "home.hero.body1": "We exist for people nobody else is reaching.",
  "home.hero.body2": "People in recovery. People who have been through the criminal justice system. People at crisis who have not been reached by conventional ministry.",
  "home.hero.accent": "Jesus Christ is the answer.",
  "home.hero.cta1": "Talk to Nura",
  "home.hero.cta2": "Learn More",
  "home.community.eyebrow": "Our Community",
  "home.community.headline": "You are not alone. Jesus sees you.",
  "home.army.headline1": "Join the Army",
  "home.army.headline2": "of the Broken",
  "home.army.headline3": "and the Beloved",
  "home.army.body": "Prayer requests. Testimonies. Real ministry. Real people. Real hope.",
  "home.army.cta1": "Submit a Prayer",
  "home.army.cta2": "Share Your Story",
  "home.hospital.eyebrow": "The Hospital",
  "home.hospital.headline1": "We are a hospital",
  "home.hospital.headline2": "for the broken",
  "home.hospital.body": "Crisis resources. Always-visible 988 access. Spiritual guidance grounded in Ethiopian Orthodox theology and centered on Jesus Christ.",
  "home.nura.eyebrow": "Meet Nura",
  "home.nura.headline": "Your 24/7 Spiritual Companion",
  "home.nura.body": "Nura is grounded in Ethiopian Orthodox theology, speaks Scripture, and points every conversation back to Jesus Christ as the solution.",
  "home.nura.cta": "Chat with Nura",
  "about.headline1": "About Misfit Ministries",
  "about.headline2": "A Hospital for the Broken",
  "about.intro": "We exist for people nobody else is reaching.",
  "about.who.headline": "Who We're After",
  "about.who.body1": "People in recovery from addiction.",
  "about.who.body2": "People who have been through the criminal justice system.",
  "about.who.body3": "People at crisis who have not been reached by conventional ministry.",
  "about.who.highlight": "Jesus Christ sees you. You are not written off.",
  "about.theology.headline": "Our Theology",
  "about.theology.body1": "We are grounded in Ethiopian Orthodox theology, including 1 Enoch, Jubilees, and the seven archangels.",
  "about.theology.body2": "We believe in Rugged Grace: straight talk, no flinching, motherly compassion.",
  "about.theology.body3": "Every word we speak points back to Jesus Christ as the solution.",
  "about.theology.body4": "We use Scripture to support all counsel.",
  "about.mission.headline1": "Our Mission",
  "about.mission.headline2": "Give a theological home to people who have been written off.",
  "about.mission.tagline": "Jesus Christ is the answer.",
  "prayer.headline": "Prayer Wall",
  "prayer.body": "Submit your prayer request. The community will pray with you. Jesus hears every prayer.",
  "prayer.submit": "Submit a Prayer",
  "prayer.anonymous": "Submit Anonymously",
  "prayer.prayed": "I Prayed for This",
  "shine.headline": "Shine",
  "shine.body": "Stories of transformation. Stories of Jesus at work. Your story matters.",
  "shine.submit": "Share Your Story",
  "wreckage.headline": "The Wreckage",
  "wreckage.body": "Crisis resources. Mental health support. Harm reduction. Always-visible 988 access.",
  "wreckage.988": "988 Suicide & Crisis Lifeline",
  "armory.headline": "The Armory",
  "armory.body": "Articles. Posts. Announcements. Grounded in Scripture. Centered on Jesus.",
  "nura.headline": "Nura",
  "nura.body": "Your 24/7 spiritual companion. Grounded in Ethiopian Orthodox theology. Centered on Jesus Christ.",
  "nura.placeholder": "What's on your heart?",
  "nura.send": "Send",
  "constitution.headline": "Nura's Constitution",
  "constitution.body": "Read the full District Rules that guide Nura's responses. Transparent. Theological. Christ-centered.",
};

export type SiteCopyKey = keyof typeof DEFAULT_SITE_COPY;

export function useSiteCopy() {
  const { data: siteCopyData } = trpc.siteCopy.getAll.useQuery();

  const dbMap = useMemo(() => {
    const map = new Map<string, string>();
    if (siteCopyData) {
      siteCopyData.forEach((item: any) => {
        map.set(item.key, item.value);
      });
    }
    return map;
  }, [siteCopyData]);

  return (key: SiteCopyKey, defaultValue?: string): string => {
    const dbValue = dbMap.get(key);
    if (dbValue) return dbValue;
    return defaultValue || DEFAULT_SITE_COPY[key] || key;
  };
}
