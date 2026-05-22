import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function ForgeCreatorMode() {
  const [activeTab, setActiveTab] = useState<'pages' | 'storefronts'>('pages');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newStorefrontName, setNewStorefrontName] = useState('');
  const [newStorefrontLayout, setNewStorefrontLayout] = useState<'grid' | 'carousel' | 'featured'>('grid');

  // Fetch pages
  const { data: pages, refetch: refetchPages } = useQuery({
    queryKey: ['forge-creator-pages'],
    queryFn: async () => {
      const res = await axios.get('/api/forge-creator/pages');
      return res.data;
    },
  });

  // Fetch storefronts
  const { data: storefronts, refetch: refetchStorefronts } = useQuery({
    queryKey: ['forge-creator-storefronts'],
    queryFn: async () => {
      const res = await axios.get('/api/forge-creator/storefronts');
      return res.data;
    },
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/forge-creator/pages', {
        slug: newPageSlug,
        title: newPageTitle,
        createdBy: 'admin',
      });
      return res.data;
    },
    onSuccess: () => {
      setNewPageTitle('');
      setNewPageSlug('');
      refetchPages();
    },
  });

  // Create storefront mutation
  const createStorefrontMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/forge-creator/storefronts', {
        name: newStorefrontName,
        layout: newStorefrontLayout,
        createdBy: 'admin',
      });
      return res.data;
    },
    onSuccess: () => {
      setNewStorefrontName('');
      setNewStorefrontLayout('grid');
      refetchStorefronts();
    },
  });

  // Publish page mutation
  const publishPageMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const res = await axios.post(`/api/forge-creator/pages/${pageId}/publish`);
      return res.data;
    },
    onSuccess: () => {
      refetchPages();
    },
  });

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2 font-cinzel">
            Forge Creator Mode
          </h1>
          <p className="text-text-secondary text-base">
            Build and manage pages and storefronts for your site
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 font-bold transition ${
              activeTab === 'pages'
                ? 'text-gold border-b-2 border-gold'
                : 'text-text-secondary hover:text-gold'
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('storefronts')}
            className={`px-4 py-2 font-bold transition ${
              activeTab === 'storefronts'
                ? 'text-gold border-b-2 border-gold'
                : 'text-text-secondary hover:text-gold'
            }`}
          >
            Storefronts
          </button>
        </div>

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded border border-dark-border">
              <h2 className="font-bold text-gold mb-4 font-cinzel text-xl">Create New Page</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Page Title"
                  value={newPageTitle}
                  onChange={e => setNewPageTitle(e.target.value)}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded font-bold"
                />
                <input
                  type="text"
                  placeholder="Page Slug (e.g., my-page)"
                  value={newPageSlug}
                  onChange={e => setNewPageSlug(e.target.value)}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded font-bold"
                />
                <button
                  onClick={() => createPageMutation.mutate()}
                  disabled={createPageMutation.isPending || !newPageTitle || !newPageSlug}
                  className="w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {createPageMutation.isPending ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gold mb-4 font-cinzel text-lg">Existing Pages</h3>
              <div className="space-y-3">
                {pages?.map((page: any) => (
                  <div
                    key={page.id}
                    className="bg-surface p-4 rounded border border-dark-border hover:border-gold transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-gold">{page.title}</p>
                        <p className="text-text-secondary text-sm">/{page.slug}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                            page.is_published
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {page.is_published ? 'Published' : 'Draft'}
                        </span>
                        {!page.is_published && (
                          <button
                            onClick={() => publishPageMutation.mutate(page.id)}
                            disabled={publishPageMutation.isPending}
                            className="px-2 py-1 rounded text-xs font-bold bg-gold text-dark hover:bg-yellow-600 transition disabled:opacity-50"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Storefronts Tab */}
        {activeTab === 'storefronts' && (
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded border border-dark-border">
              <h2 className="font-bold text-gold mb-4 font-cinzel text-xl">Create Storefront</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Storefront Name"
                  value={newStorefrontName}
                  onChange={e => setNewStorefrontName(e.target.value)}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded font-bold"
                />
                <select
                  value={newStorefrontLayout}
                  onChange={e => setNewStorefrontLayout(e.target.value as 'grid' | 'carousel' | 'featured')}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded font-bold"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="carousel">Carousel Layout</option>
                  <option value="featured">Featured Layout</option>
                </select>
                <button
                  onClick={() => createStorefrontMutation.mutate()}
                  disabled={createStorefrontMutation.isPending || !newStorefrontName}
                  className="w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {createStorefrontMutation.isPending ? 'Creating...' : 'Create Storefront'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gold mb-4 font-cinzel text-lg">Storefronts</h3>
              <div className="space-y-3">
                {storefronts?.map((storefront: any) => (
                  <div
                    key={storefront.id}
                    className="bg-surface p-4 rounded border border-dark-border hover:border-gold transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-gold">{storefront.name}</p>
                        <p className="text-text-secondary text-sm">{storefront.layout} layout</p>
                        <p className="text-text-secondary text-xs mt-1">
                          Created {new Date(storefront.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                          storefront.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {storefront.is_published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
