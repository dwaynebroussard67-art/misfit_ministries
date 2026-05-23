import { useState } from 'react';
import { ResponsiveLayout, ResponsiveCard } from '../components/ResponsiveLayout';

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/prayers',
      description: 'Submit a prayer',
      tags: ['Prayers'],
      params: [
        { name: 'text', type: 'string', required: true, desc: 'Prayer text' },
        { name: 'userName', type: 'string', required: false, desc: 'Submitter name' },
        { name: 'latitude', type: 'number', required: false, desc: 'Geographic latitude' },
        { name: 'longitude', type: 'number', required: false, desc: 'Geographic longitude' },
      ],
      example: {
        request: { text: 'I need help...', userName: 'John' },
        response: { id: 1, crisisFlag: true, message: 'Prayer submitted' },
      },
    },
    {
      method: 'POST',
      path: '/api/nura/chat',
      description: 'Chat with Nura AI',
      tags: ['Nura AI'],
      params: [
        { name: 'message', type: 'string', required: true, desc: 'Chat message' },
        { name: 'conversationId', type: 'string', required: false, desc: 'Conversation ID' },
      ],
      example: {
        request: { message: 'I am struggling...' },
        response: { response: 'I hear you...', audioUrl: 'https://...', crisisDetected: false },
      },
    },
    {
      method: 'POST',
      path: '/api/narcan/help-now',
      description: 'Send OD emergency alert',
      tags: ['Narcan First Responders'],
      params: [
        { name: 'latitude', type: 'number', required: true, desc: 'Emergency location latitude' },
        { name: 'longitude', type: 'number', required: true, desc: 'Emergency location longitude' },
      ],
      example: {
        request: { latitude: 40.7128, longitude: -74.006 },
        response: { alertId: 'alert_123', respondersNotified: 5 },
      },
    },
    {
      method: 'GET',
      path: '/api/store/products',
      description: 'Get merchandise products',
      tags: ['Store'],
      params: [
        { name: 'limit', type: 'integer', required: false, desc: 'Results limit', default: 20 },
        { name: 'offset', type: 'integer', required: false, desc: 'Results offset', default: 0 },
      ],
      example: {
        request: { limit: 20, offset: 0 },
        response: [
          { id: 'prod_1', name: 'Misfit Hoodie', price: 9999, image: 'https://...' },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/video-testimonials',
      description: 'Get published video testimonials',
      tags: ['Testimonials'],
      params: [
        { name: 'limit', type: 'integer', required: false, desc: 'Results limit', default: 20 },
      ],
      example: {
        request: { limit: 20 },
        response: [
          {
            id: 1,
            title: 'My Recovery Story',
            videoUrl: 'https://...',
            userName: 'Anonymous',
            viewCount: 150,
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/analytics',
      description: 'Get platform analytics (ADMIN)',
      tags: ['Analytics'],
      params: [
        { name: 'range', type: 'string', required: false, desc: 'Time range', default: '24h' },
      ],
      example: {
        request: { range: '24h' },
        response: {
          totalPrayers: 150,
          crisisPrayers: 5,
          totalResponders: 200,
          totalRevenue: 50000,
        },
      },
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gold mb-2">API Documentation</h1>
          <p className="text-text-secondary text-sm md:text-base">
            Build with Misfit Ministries. Integrate prayer data, Nura AI, and responder network.
          </p>
        </div>

        {/* Quick Start */}
        <ResponsiveCard>
          <h2 className="font-bold text-gold mb-3">🚀 Quick Start</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-text-secondary mb-1">Base URL:</p>
              <code className="bg-dark-border p-2 rounded block text-gold font-mono">
                https://api.misfitministries.com
              </code>
            </div>
            <div>
              <p className="text-text-secondary mb-1">Authentication:</p>
              <code className="bg-dark-border p-2 rounded block text-gold font-mono">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <div>
              <p className="text-text-secondary mb-1">Content Type:</p>
              <code className="bg-dark-border p-2 rounded block text-gold font-mono">
                Content-Type: application/json
              </code>
            </div>
          </div>
        </ResponsiveCard>

        {/* Endpoints */}
        <div>
          <h2 className="text-2xl font-bold text-gold mb-4">📚 Endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((endpoint, i) => (
              <div
                key={i}
                className="bg-surface border border-dark-border rounded cursor-pointer hover:border-gold transition"
                onClick={() =>
                  setSelectedEndpoint(selectedEndpoint === endpoint.path ? null : endpoint.path)
                }
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded font-bold text-sm ${
                        endpoint.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-400'
                          : endpoint.method === 'POST'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <div>
                      <p className="font-mono text-gold text-sm md:text-base">{endpoint.path}</p>
                      <p className="text-text-secondary text-xs md:text-sm">
                        {endpoint.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-gold text-xl">
                    {selectedEndpoint === endpoint.path ? '▼' : '▶'}
                  </span>
                </div>

                {/* Expanded Details */}
                {selectedEndpoint === endpoint.path && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    {/* Parameters */}
                    {endpoint.params.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gold mb-2">Parameters:</h4>
                        <div className="space-y-2 text-sm">
                          {endpoint.params.map((param, j) => (
                            <div key={j} className="bg-dark-border p-2 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-blue-400 font-mono">{param.name}</code>
                                <span className="text-text-secondary text-xs">{param.type}</span>
                                {param.required && (
                                  <span className="text-red text-xs font-bold">required</span>
                                )}
                              </div>
                              <p className="text-text-secondary text-xs">{param.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example */}
                    <div>
                      <h4 className="font-bold text-gold mb-2">Example:</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-text-secondary mb-1">Request:</p>
                          <code className="bg-dark-border p-2 rounded block text-green-400 font-mono overflow-x-auto">
                            {JSON.stringify(endpoint.example.request, null, 2)}
                          </code>
                        </div>
                        <div>
                          <p className="text-text-secondary mb-1">Response:</p>
                          <code className="bg-dark-border p-2 rounded block text-blue-400 font-mono overflow-x-auto">
                            {JSON.stringify(endpoint.example.response, null, 2)}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SDKs */}
        <ResponsiveCard>
          <h2 className="font-bold text-gold mb-3">📦 SDKs & Libraries</h2>
          <div className="space-y-2 text-sm">
            <p className="text-text-secondary">Official SDKs coming soon:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>JavaScript/TypeScript</li>
              <li>Python</li>
              <li>Go</li>
              <li>Ruby</li>
            </ul>
          </div>
        </ResponsiveCard>

        {/* Support */}
        <ResponsiveCard className="bg-gold/10 border-gold/50">
          <h2 className="font-bold text-gold mb-3">💬 Support</h2>
          <p className="text-text-secondary text-sm mb-3">
            Have questions? Join our developer community.
          </p>
          <a
            href="https://discord.gg/misfitministries"
            className="text-gold font-bold hover:underline text-sm"
          >
            Discord Community →
          </a>
        </ResponsiveCard>
      </div>
    </ResponsiveLayout>
  );
}

