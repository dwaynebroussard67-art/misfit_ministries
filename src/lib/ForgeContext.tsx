import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadAllContent } from './cms';

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
}

interface ForgeContextType {
  getText: (id: string, fallback: string) => string;
  getImageForSlot: (slotId: string) => GalleryImage | null;
}

const ForgeContext = createContext<ForgeContextType | null>(null);

export function ForgeProvider({ children }: { children: ReactNode }) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [placements, setPlacements] = useState<Record<string, any>>({});

  useEffect(() => {
    loadAllContent().then((map) => {
      const loadedTexts: Record<string, string> = {};
      Object.keys(map).forEach((key) => {
        if (key.startsWith('text:')) loadedTexts[key.slice(5)] = map[key];
      });
      setTexts(loadedTexts);
      if (map['_gallery']) { try { setGallery(JSON.parse(map['_gallery'])); } catch {} }
      if (map['_placements']) { try { setPlacements(JSON.parse(map['_placements'])); } catch {} }
    });
  }, []);

  const getText = (id: string, fallback: string): string => texts[id] ?? fallback;

  const getImageForSlot = (slotId: string): GalleryImage | null => {
    const p = placements[slotId];
    if (!p) return null;
    return gallery.find((img) => img.id === p.imageId) || null;
  };

  return (
    <ForgeContext.Provider value={{ getText, getImageForSlot }}>
      {children}
    </ForgeContext.Provider>
  );
}

export function useForge() {
  const ctx = useContext(ForgeContext);
  if (!ctx) throw new Error('useForge must be used inside ForgeProvider');
  return ctx;
}
