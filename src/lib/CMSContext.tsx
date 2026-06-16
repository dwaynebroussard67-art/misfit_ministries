import { createContext, useContext, useEffect, useState } from 'react';
import { loadAllContent, saveContent } from './cms';

type CMSType = {
  get: (key: string, fallback: string) => string;
  save: (key: string, value: string) => Promise<boolean>;
  ready: boolean;
};

const CMSContext = createContext<CMSType>({
  get: (_k, fallback) => fallback,
  save: async () => false,
  ready: false,
});

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAllContent().then((map) => {
      setContent(map);
      setReady(true);
    });
  }, []);

  const get = (key: string, fallback: string) => {
    return content[key] ?? fallback;
  };

  const save = async (key: string, value: string) => {
    const ok = await saveContent(key, value);
    if (ok) setContent((prev) => ({ ...prev, [key]: value }));
    return ok;
  };

  return (
    <CMSContext.Provider value={{ get, save, ready }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => useContext(CMSContext);
