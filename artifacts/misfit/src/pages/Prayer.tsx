import { useState, useEffect } from 'react';
import { AlertCircle, Send, Filter, Heart } from 'lucide-react';

interface Prayer {
  id: number;
  name: string | null;
  request: string;
  category: string;
  is_anonymous: boolean;
  crisis_flag: boolean;
  flagged_keywords: string | null;
  status: string;
  created_at: string;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  phone: string | null;
  url: string | null;
  available_247: boolean;
}

const PRAYER_CATEGORIES = [
  { id: 'all', label: 'All Prayers' },
  { id: 'family', label: 'Family' },
  { id: 'health', label: 'Health' },
  { id: 'finances', label: 'Finances' },
  { id: 'spiritual-growth', label: 'Spiritual Growth' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'work', label: 'Work' },
  { id: 'addiction-recovery', label: 'Addiction Recovery' },
  { id: 'housing', label: 'Housing' },
  { id: 'legal', label: 'Legal' },
  { id: 'other', label: 'Other' },
];

export default function Prayer() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [prayerText, setPrayerText] = useState('');
  const [prayerName, setPrayerName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
    fetchResources();
  }, [selectedCategory]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? '/api/prayers' 
        : `/api/prayers?category=${selectedCategory}`;
      const response = await fetch(url);
      const data = await response.json();
      setPrayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      setPrayers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: prayerText,
          name: isAnonymous ? null : prayerName,
          category: selectedCategory === 'all' ? 'other' : selectedCategory,
          is_anonymous: isAnonymous,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(
          data.crisis_flag
            ? '🚨 Prayer submitted. Crisis detected. 988 resources are available below.'
            : '✅ Prayer submitted. Thank you for sharing.'
        );
        if (data.crisis_flag) {
          setShowCrisisAlert(true);
        }
        setPrayerText('');
        setPrayerName('');
        setIsAnonymous(false);
        setTimeout(() => {
          setSubmitMessage('');
          fetchPrayers();
        }, 3000);
      } else {
        setSubmitMessage('Error submitting prayer. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting prayer:', error);
      setSubmitMessage('Error submitting prayer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const crisisResources = resources.filter(r => r.category === 'Crisis Support');

  return (
    <div className="min-h-screen bg-dark">
      {/* Crisis Alert Banner */}
      {showCrisisAlert && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-200 font-bold mb-2">🚨 Crisis Resources Available</h3>
              <p className="text-red-100 mb-3">
                If you or someone you know is in crisis, please reach out immediately:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {crisisResources.slice(0, 4).map(resource => (
                  <div key={resource.id} className="bg-red-800 p-3 rounded">
                    <p className="font-semibold text-red-100">{resource.title}</p>
                    {resource.phone && (
                      <p className="text-red-200 text-sm">
                        Call: <a href={`tel:${resource.phone}`} className="font-bold hover:underline">
                          {resource.phone}
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowCrisisAlert(false)}
                className="mt-3 text-red-200 hover:text-red-100 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Prayer Wall</h1>
          <p className="text-text-secondary">
            Submit your prayer request and let our community pray with you. Every prayer matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prayer Submission Form */}
          <div className="lg:col-span-1">
            <div className="bg-dark-secondary rounded-lg p-6 border border-gold/20 sticky top-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Submit a Prayer</h2>
              
              <form onSubmit={handleSubmitPrayer} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isAnonymous}
                    className="w-full px-4 py-2 bg-dark border border-gold/30 rounded text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold disabled:opacity-50"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-gold bg-dark border-gold/30 rounded focus:ring-gold"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-text-secondary">
                    Submit anonymously
                  </label>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory === 'all' ? 'other' : selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-dark border border-gold/30 rounded text-text-primary focus:outline-none focus:border-gold"
                  >
                    {PRAYER_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prayer Text */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Your Prayer Request
                  </label>
                  <textarea
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    placeholder="Share what's on your heart..."
                    rows={5}
                    className="w-full px-4 py-2 bg-dark border border-gold/30 rounded text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    {prayerText.length} characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!prayerText.trim() || isSubmitting}
                  className="w-full bg-gold text-dark font-bold py-3 rounded hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Submitting...' : 'Submit Prayer'}
                </button>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-3 rounded text-sm ${
                    submitMessage.includes('✅') 
                      ? 'bg-green-900/30 text-green-200' 
                      : 'bg-red-900/30 text-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                {/* Crisis Notice */}
                <div className="bg-red-900/20 border border-red-500/30 rounded p-3 text-xs text-red-200">
                  <p className="font-semibold mb-1">🚨 In Crisis?</p>
                  <p>Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741</p>
                </div>
              </form>
            </div>
          </div>

          {/* Prayer List */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
              <Filter size={18} className="text-gold flex-shrink-0" />
              <div className="flex gap-2 flex-nowrap">
                {PRAYER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-gold text-dark font-semibold'
                        : 'bg-dark-secondary text-text-secondary hover:text-gold border border-gold/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prayers Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">Loading prayers...</p>
              </div>
            ) : prayers.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto mb-4 text-gold/50" size={48} />
                <p className="text-text-secondary">No prayers in this category yet.</p>
                <p className="text-text-secondary text-sm mt-2">Be the first to share.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prayers.map(prayer => (
                  <div
                    key={prayer.id}
                    className={`rounded-lg p-6 border transition-all ${
                      prayer.crisis_flag
                        ? 'bg-red-900/20 border-red-500/30'
                        : 'bg-dark-secondary border-gold/20 hover:border-gold/50'
                    }`}
                  >
                    {/* Crisis Badge */}
                    {prayer.crisis_flag && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-red-500/30">
                        <AlertCircle size={16} className="text-red-500" />
                        <span className="text-red-200 text-sm font-semibold">Crisis Support Available</span>
                      </div>
                    )}

                    {/* Prayer Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-text-primary font-semibold">
                          {prayer.is_anonymous ? 'Anonymous' : prayer.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(prayer.created_at).toLocaleDateString()} • {prayer.category}
                        </p>
                      </div>
                      <Heart size={18} className="text-gold/50" />
                    </div>

                    {/* Prayer Text */}
                    <p className="text-text-secondary mb-3 line-clamp-3">{prayer.request}</p>

                    {/* Keywords */}
                    {prayer.flagged_keywords && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {prayer.flagged_keywords.split(', ').map((keyword, i) => (
                          <span
                            key={i}
                            className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <button className="text-gold text-sm font-semibold hover:underline">
                      Pray for this →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Crisis Resources Section */}
        {crisisResources.length > 0 && (
          <div className="mt-12 bg-dark-secondary rounded-lg p-8 border border-red-500/30">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold text-red-400">Crisis Support Resources</h2>
            </div>
            <p className="text-text-secondary mb-6">
              If you or someone you know is struggling, these resources are available 24/7:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {crisisResources.map(resource => (
                <div
                  key={resource.id}
                  className="bg-dark rounded-lg p-4 border border-red-500/20 hover:border-red-500/50 transition-colors"
                >
                  <h3 className="font-bold text-red-300 mb-2">{resource.title}</h3>
                  <p className="text-xs text-text-secondary mb-3">{resource.description}</p>
                  <div className="space-y-2">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="block text-gold text-sm font-semibold hover:underline"
                      >
                        📞 {resource.phone}
                      </a>
                    )}
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gold text-sm font-semibold hover:underline"
                      >
                        🌐 Learn More
                      </a>
                    )}
                  </div>
                  {resource.available_247 && (
                    <p className="text-xs text-green-400 mt-2">✓ Available 24/7</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
