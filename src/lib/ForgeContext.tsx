import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  const [placements, setPlacements] = useState<Record<string, ImagePlacement>>(() => {
    try { return JSON.parse(localStorage.getItem('misfit-placements') || '{}'); } catch { return {}; }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('misfit-texts') || '{}'); } catch { return {}; }
  });

  const toggleForge = useCallback(() => {
    setForgeActive(prev => !prev);
    setEditingId(null);
  }, []);

  const addImages = useCallback((files: FileList) => {
    const newImages: GalleryImage[] = Array.from(files).map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      uploadedAt: new Date().toISOString(),
      opacity: 1,
    }));
    setGallery(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setGallery(prev => prev.filter(img => img.id !== id));
  }, []);

  const assignImage = useCallback((imageId: string, slotId: string, placement = 'cover', opacity = 1) => {
    const newPlacements = {
      ...placements,
      [slotId]: { slotId, imageId, placement: placement as any, opacity },
    };
    setPlacements(newPlacements);
    localStorage.setItem('misfit-placements', JSON.stringify(newPlacements));
  }, [placements]);

  const getImageForSlot = useCallback((slotId: string): GalleryImage | null => {
    const placement = placements[slotId];
    if (!placement) return null;
    return gallery.find(img => img.id === placement.imageId) || null;
  }, [gallery, placements]);

  const saveText = useCallback((id: string, text: string) => {
    setTexts(prev => {
      const next = { ...prev, [id]: text };
      localStorage.setItem('misfit-texts', JSON.stringify(next));
      return next;
    });
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
