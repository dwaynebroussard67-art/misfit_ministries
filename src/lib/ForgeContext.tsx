import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { loadAllContent, saveContent, uploadImage } from './cms';

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  assignedTo?: string;
  placement?: 'cover' | 'background' | 'inline' | 'hero';
  opacity?: number;
}

export interface ImagePlacement {
  slotId: string;
  imageId: string;
  placement: 'cover' | 'background' | 'inline' | 'hero';
  opacity: number;
}

interface ForgeContextType {
  forgeActive: boolean;
  toggleForge: () => void;
  gallery: GalleryImage[];
  addImages: (files: FileList) => void;
  removeImage: (id: string) => void;
  assignImage: (imageId: string, slotId: string, placement?: string, opacity?: number) => void;
  getImageForSlot: (slotId: string) => GalleryImage | null;
  placements: Record<string, ImagePlacement>;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  saveText: (id: string, text: string) => void;
  getText: (id: string, fallback: string) => string;
  draggedImage: string | null;
  setDraggedImage: (id: string | null) => void;
}

const ForgeContext = createContext<ForgeContextType | null>(null);

export function ForgeProvider({ children }: { children: ReactNode }) {
  const [forgeActive, setForgeActive] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [placements, setPlacements] = useState<Record<string, ImagePlacement>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);

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

  const toggleForge = useCallback(() => {
    setForgeActive((prev) => !prev);
    setEditingId(null);
  }, []);

  const addImages = useCallback((files: FileList) => {
    Array.from(files).forEach(async (file) => {
      const url = await uploadImage(file);
      if (!url) return;
      const newImage: GalleryImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url, name: file.name, uploadedAt: new Date().toISOString(), opacity: 1,
      };
      setGallery((prev) => {
        const next = [...prev, newImage];
        saveContent('_gallery', JSON.stringify(next));
        return next;
      });
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setGallery((prev) => {
      const next = prev.filter((img) => img.id !== id);
      saveContent('_gallery', JSON.stringify(next));
      return next;
    });
  }, []);

  const assignImage = useCallback((imageId: string, slotId: string, placement = 'cover', opacity = 1) => {
    setPlacements((prev) => {
      const next = { ...prev, [slotId]: { slotId, imageId, placement: placement as any, opacity } };
      saveContent('_placements', JSON.stringify(next));
      return next;
    });
  }, []);

  const getImageForSlot = useCallback((slotId: string): GalleryImage | null => {
    const placement = placements[slotId];
    if (!placement) return null;
    return gallery.find((img) => img.id === placement.imageId) || null;
  }, [gallery, placements]);

  const saveText = useCallback((id: string, text: string) => {
    setTexts((prev) => ({ ...prev, [id]: text }));
    saveContent(`text:${id}`, text);
    setEditingId(null);
  }, []);

  const getText = useCallback((id: string, fallback: string): string => {
    return texts[id] ?? fallback;
  }, [texts]);

  return (
    <ForgeContext.Provider value={{
      forgeActive, toggleForge,
      gallery, addImages, removeImage, assignImage, getImageForSlot, placements,
      editingId, setEditingId, saveText, getText,
      draggedImage, setDraggedImage,
    }}>
      {children}
    </ForgeContext.Provider>
  );
}

export function useForge() {
  const ctx = useContext(ForgeContext);
  if (!ctx) throw new Error('useForge must be used inside ForgeProvider');
  return ctx;
}
