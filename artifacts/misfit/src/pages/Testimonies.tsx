import { useState, useEffect } from 'react';
import { Play, Star, Users } from 'lucide-react';
import { ImageHero } from '../components/ImageHero';
import { ImageGallery } from '../components/ImageGallery';

interface TextTestimony {
  id: number;
  name: string;
  title: string;
  story: string;
  featured: boolean;
  created_at: string;
}

interface VideoTestimony {
  id: number;
  user_name: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  view_count: number;
  created_at: string;
}

export default function Testimonies() {
  const [textTestimonies, setTextTestimonies] = useState<TextTestimony[]>([]);
  const [videoTestimonies, setVideoTestimonies] = useState<VideoTestimony[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimony | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const [textRes, videoRes] = await Promise.all([
        fetch('/api/testimonies'),
        fetch('/api/video-testimonials'),
      ]);

      const textData = await textRes.json();
      const videoData = await videoRes.json();

      setTextTestimonies(Array.isArray(textData) ? textData : []);
      setVideoTestimonies(Array.isArray(videoData) ? videoData : []);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredTestimonies = textTestimonies.filter(t => t.featured).slice(0, 3);
  const otherTestimonies = textTestimonies.filter(t => !t.featured);

  return (
    <>
      {/* Hero Section */}
      <ImageHero
        imageSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=600&fit=crop"
        overlayOpacity={0.6}
        overlayColor="from-black/70 to-black/50"
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Testimonies
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Real stories of transformation. Real people. Real faith.
          </p>
        </div>
      </ImageHero>

      <div className="min-h-screen bg-dark">
        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-dark rounded-lg max-w-2xl w-full">
              <div className="relative bg-black aspect-video rounded-t-lg overflow-hidden">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gold mb-2">{selectedVideo.title}</h3>
                <p className="text-text-secondary mb-4">{selectedVideo.description}</p>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>By {selectedVideo.user_name}</span>
                  <span>{selectedVideo.view_count} views</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-full bg-dark-secondary text-gold py-3 font-semibold hover:bg-dark-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gold mb-4">Testimonies</h1>
            <p className="text-text-secondary text-lg">
              Real stories of transformation. Real people. Real faith. These are the stories of Misfits who found redemption, hope, and purpose.
            </p>
          </div>

          {/* Featured Testimonies */}
          {featuredTestimonies.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-gold" size={24} />
                <h2 className="text-3xl font-bold text-gold">Featured Stories</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTestimonies.map(testimony => (
                  <div
                    key={testimony.id}
                    className="bg-dark-secondary rounded-lg p-6 border border-gold/30 hover:border-gold/60 transition-all hover:shadow-lg hover:shadow-gold/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gold">{testimony.title}</h3>
                        <p className="text-sm text-text-secondary">{testimony.name}</p>
                      </div>
                      <Star className="text-gold flex-shrink-0" size={20} fill="currentColor" />
                    </div>
                    <p className="text-text-secondary mb-4 line-clamp-4">{testimony.story}</p>
                    <button className="text-gold font-semibold hover:underline text-sm">
                      Read Full Story →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Testimonies */}
          {videoTestimonies.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Play className="text-gold" size={24} />
                <h2 className="text-3xl font-bold text-gold">Video Testimonies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videoTestimonies.map(video => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gold/30 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-black aspect-video">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gold/20 to-dark flex items-center justify-center">
                          <Play className="text-gold/50" size={48} />
                        </div>
                      )}
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-gold/90 group-hover:bg-gold p-3 rounded-full transition-colors">
                          <Play className="text-dark" size={24} fill="currentColor" />
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                        {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-dark-secondary p-4">
                      <h3 className="font-bold text-gold text-left mb-1 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-text-secondary text-left mb-2">{video.user_name}</p>
                      <p className="text-xs text-text-secondary text-left">{video.view_count} views</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Text Testimonies */}
          {otherTestimonies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gold mb-6">All Stories</h2>
              <div className="space-y-6">
                {otherTestimonies.map(testimony => (
                  <div
                    key={testimony.id}
                    className="bg-dark-secondary rounded-lg p-8 border border-gold/20 hover:border-gold/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gold mb-1">{testimony.title}</h3>
                        <p className="text-text-secondary">{testimony.name}</p>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {new Date(testimony.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-4">{testimony.story}</p>
                    <button className="text-gold font-semibold hover:underline">
                      Share This Story →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Loading testimonies...</p>
            </div>
          ) : textTestimonies.length === 0 && videoTestimonies.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gold/50" size={48} />
              <p className="text-text-secondary">No testimonies yet.</p>
              <p className="text-text-secondary text-sm mt-2">Check back soon for inspiring stories of transformation.</p>
            </div>
          ) : null}

          {/* Redemption Gallery */}
          <div className="mt-12 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gold mb-4">Stories of Redemption</h2>
              <p className="text-text-secondary">Hope is real. Change is possible. Transformation happens.</p>
            </div>
            <ImageGallery
              images={[
                { src: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop', alt: 'Faith journey' },
                { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', alt: 'Hope in ruins' },
                { src: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop', alt: 'Hope community' },
              ]}
            />
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-8 border border-gold/30 text-center">
            <h3 className="text-2xl font-bold text-gold mb-3">Share Your Story</h3>
            <p className="text-text-secondary mb-6">
              Your testimony could be the breakthrough someone needs. Share how God has worked in your life.
            </p>
            <button className="bg-gold text-dark font-bold px-8 py-3 rounded hover:bg-gold/90 transition-colors">
              Submit Your Testimony
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
