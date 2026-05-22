import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function HeatmapViewer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<'hotspots' | 'density'>('hotspots');
  const mapRef = useRef<any>(null);

  const { data: hotspots } = useQuery({
    queryKey: ['heatmap-hotspots'],
    queryFn: async () => {
      const res = await axios.get('/api/heatmap/od-hotspots');
      return res.data;
    },
  });

  const { data: density } = useQuery({
    queryKey: ['heatmap-density'],
    queryFn: async () => {
      const res = await axios.get('/api/heatmap/responder-density');
      return res.data;
    },
  });

  const { data: coverage } = useQuery({
    queryKey: ['heatmap-coverage'],
    queryFn: async () => {
      const res = await axios.get('/api/heatmap/coverage');
      return res.data;
    },
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with Leaflet (requires leaflet library)
    // This is a placeholder - actual implementation would use Leaflet.js
    const mapElement = mapContainer.current;
    mapElement.innerHTML = `
      <div style=\"width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 2px solid #ffd700;\">
        <div style=\"text-align: center; color: #ffd700;\">
          <p style=\"font-size: 18px; font-weight: bold; margin: 0;\">📍 Heatmap Viewer</p>
          <p style=\"font-size: 14px; color: #999; margin: 8px 0 0 0;\">
            ${mapType === 'hotspots' ? 'OD Hotspots' : 'Responder Density'}
          </p>
          <p style=\"font-size: 12px; color: #666; margin: 8px 0 0 0;\">
            (Requires Leaflet.js integration)
          </p>
        </div>
      </div>
    `;
  }, [mapType]);

  return (
    <div className=\"space-y-4\">
      {/* Controls */}
      <div className=\"flex flex-col md:flex-row gap-3 md:gap-4\">
        <div className=\"flex gap-2\">
          <button
            onClick={() => setMapType('hotspots')}
            className={`px-4 py-2 rounded font-bold transition ${
              mapType === 'hotspots'
                ? 'bg-gold text-dark'
                : 'bg-dark-border text-text-secondary hover:bg-dark'
            }`}
          >
            🔴 OD Hotspots
          </button>
          <button
            onClick={() => setMapType('density')}
            className={`px-4 py-2 rounded font-bold transition ${
              mapType === 'density'
                ? 'bg-gold text-dark'
                : 'bg-dark-border text-text-secondary hover:bg-dark'
            }`}
          >
            👥 Responder Density
          </button>
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapContainer}
        className=\"w-full h-96 md:h-screen rounded-lg border-2 border-gold/30\"
      />

      {/* Stats */}
      <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3\">
        <div className=\"bg-surface p-4 rounded border border-dark-border\">
          <p className=\"text-text-secondary text-xs md:text-sm\">Total Incidents</p>
          <p className=\"text-2xl md:text-3xl font-bold text-red\">
            {hotspots?.totalIncidents || 0}
          </p>
        </div>

        <div className=\"bg-surface p-4 rounded border border-dark-border\">
          <p className=\"text-text-secondary text-xs md:text-sm\">Active Responders</p>
          <p className=\"text-2xl md:text-3xl font-bold text-green-500\">
            {density?.totalResponders || 0}
          </p>
        </div>

        <div className=\"bg-surface p-4 rounded border border-dark-border\">
          <p className=\"text-text-secondary text-xs md:text-sm\">With Narcan</p>
          <p className=\"text-2xl md:text-3xl font-bold text-gold\">
            {density?.respondersWithNarcan || 0}
          </p>
        </div>

        <div className=\"bg-surface p-4 rounded border border-dark-border\">
          <p className=\"text-text-secondary text-xs md:text-sm\">Avg Response</p>
          <p className=\"text-2xl md:text-3xl font-bold text-blue-400\">
            {coverage?.averageResponseTime || 0}m
          </p>
        </div>
      </div>

      {/* Coverage Analysis */}
      {coverage && (
        <div className=\"bg-surface p-4 md:p-6 rounded border border-dark-border\">
          <h3 className=\"font-bold text-gold mb-4\">Coverage Analysis</h3>
          <div className=\"space-y-3\">
            <div className=\"flex justify-between items-center\">
              <span className=\"text-text-secondary\">Responder Coverage</span>
              <div className=\"flex-1 mx-4 bg-dark-border rounded-full h-3\">
                <div
                  className=\"bg-gold h-full rounded-full\"
                  style={{
                    width: `${coverage?.totalResponders ? Math.min((coverage.respondersWithNarcan / coverage.totalResponders) * 100, 100) : 0}%`,
                  }}
                />
              </div>
              <span className=\"text-gold font-bold text-sm\">
                {coverage?.respondersWithNarcan}/{coverage?.totalResponders}
              </span>
            </div>

            {coverage?.uncoveredAreas && coverage.uncoveredAreas.length > 0 && (
              <div className=\"bg-red/10 border border-red/30 p-3 rounded\">
                <p className=\"text-red font-bold text-sm mb-2\">
                  ⚠️ {coverage.uncoveredAreas.length} Uncovered Areas
                </p>
                <ul className=\"text-text-secondary text-xs space-y-1\">
                  {coverage.uncoveredAreas.slice(0, 3).map((area: any, i: number) => (
                    <li key={i}>• {area.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

