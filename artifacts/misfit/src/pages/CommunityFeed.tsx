import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function CommunityFeed() {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    responder_id: '',
    title: '',
    story: '',
  });

  const { data: stories, refetch } = useQuery({
    queryKey: ['responder-stories'],
    queryFn: async () => {
      const res = await axios.get('/api/stories');
      return res.data;
    },
  });

  const submitStoryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('/api/stories', {
        responder_id: parseInt(data.responder_id),
        title: data.title,
        story: data.story,
      });
      return res.data;
    },
    onSuccess: () => {
      setShowSubmitForm(false);
      setFormData({ responder_id: '', title: '', story: '' });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitStoryMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">Community Feed</h1>
          <p className="text-2xl text-text-secondary mb-6">
            Real stories of dope fiends saving dope fiends.
          </p>
          <p className="text-lg text-text-secondary mb-8">
            Every life saved is a victory. Every responder is a hero. Share your story.
          </p>
        </div>

        {/* Submit Story Button */}
        <div className="mb-12">
          {!showSubmitForm ? (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="bg-gold text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
            >
              Share Your Story
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg max-w-2xl">
              <h2 className="text-2xl font-bold text-gold mb-6">Share Your Save</h2>
              
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Your Responder ID</label>
                <input
                  type="number"
                  required
                  value={formData.responder_id}
                  onChange={e => setFormData({ ...formData, responder_id: e.target.value })}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 'How I Saved My Brother'"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="mb-6">
                <label className="block text-text-secondary mb-2">Your Story</label>
                <textarea
                  required
                  placeholder="Tell us what happened. How did you save them? What was it like?"
                  value={formData.story}
                  onChange={e => setFormData({ ...formData, story: e.target.value })}
                  rows={6}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitStoryMutation.isPending}
                  className="flex-1 bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {submitStoryMutation.isPending ? 'Submitting...' : 'Share Story'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 bg-dark-border text-text-secondary px-4 py-2 rounded font-bold hover:bg-dark transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stories Feed */}
        <div className="space-y-6">
          {stories && stories.length > 0 ? (
            stories.map((story: any) => (
              <div key={story.id} className="bg-surface p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gold mb-2">{story.title}</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Responder #{story.responder_id} • {story.lives_saved} life saved
                </p>
                <p className="text-text-primary mb-4">{story.story}</p>
                <p className="text-text-secondary text-xs">
                  {new Date(story.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">No stories yet. Be the first to share.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
