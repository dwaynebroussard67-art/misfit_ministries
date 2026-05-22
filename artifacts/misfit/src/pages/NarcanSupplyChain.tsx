import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function NarcanSupplyChain() {
  const [tab, setTab] = useState<'shipments' | 'distribution'>('shipments');
  const [showNewShipment, setShowNewShipment] = useState(false);
  const [formData, setFormData] = useState({
    source: 'government',
    quantity: '',
    origin_location: '',
    destination_location: '',
    tracking_number: '',
  });

  const { data: supplyData, refetch } = useQuery({
    queryKey: ['narcan-supply-chain'],
    queryFn: async () => {
      const res = await axios.get('/api/narcan/supply-chain/shipments');
      return res.data;
    },
  });

  const createShipmentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('/api/narcan/supply-chain/shipments', {
        source: data.source,
        quantity: parseInt(data.quantity),
        origin_location: data.origin_location,
        destination_location: data.destination_location,
        tracking_number: data.tracking_number || undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      setShowNewShipment(false);
      setFormData({
        source: 'government',
        quantity: '',
        origin_location: '',
        destination_location: '',
        tracking_number: '',
      });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShipmentMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">Narcan Supply Chain</h1>
          <p className="text-2xl text-text-secondary">
            Track government shipments, manage distribution, monitor inventory.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface p-4 rounded">
            <p className="text-gold text-2xl font-bold">{supplyData?.stats.total_kits || 0}</p>
            <p className="text-text-secondary text-sm">Total Kits</p>
          </div>
          <div className="bg-surface p-4 rounded">
            <p className="text-gold text-2xl font-bold">{supplyData?.stats.pending || 0}</p>
            <p className="text-text-secondary text-sm">Pending</p>
          </div>
          <div className="bg-surface p-4 rounded">
            <p className="text-gold text-2xl font-bold">{supplyData?.stats.in_transit || 0}</p>
            <p className="text-text-secondary text-sm">In Transit</p>
          </div>
          <div className="bg-surface p-4 rounded">
            <p className="text-gold text-2xl font-bold">{supplyData?.stats.received || 0}</p>
            <p className="text-text-secondary text-sm">Received</p>
          </div>
          <div className="bg-surface p-4 rounded">
            <p className="text-gold text-2xl font-bold">{supplyData?.stats.distributed || 0}</p>
            <p className="text-text-secondary text-sm">Distributed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-dark-border">
          {['shipments', 'distribution'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 font-bold transition ${
                tab === t
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Shipments Tab */}
        {tab === 'shipments' && (
          <div>
            <div className="mb-8">
              {!showNewShipment ? (
                <button
                  onClick={() => setShowNewShipment(true)}
                  className="bg-gold text-dark px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
                >
                  + New Shipment
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-lg max-w-2xl">
                  <h2 className="text-2xl font-bold text-gold mb-6">Track New Shipment</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-text-secondary mb-2">Source</label>
                      <select
                        value={formData.source}
                        onChange={e => setFormData({ ...formData, source: e.target.value })}
                        className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"
                      >
                        <option value="government">Government</option>
                        <option value="donation">Donation</option>
                        <option value="purchase">Purchase</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-2">Quantity</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-text-secondary mb-2">Origin Location</label>
                    <input
                      type="text"
                      required
                      value={formData.origin_location}
                      onChange={e => setFormData({ ...formData, origin_location: e.target.value })}\n                      className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"\n                    />\n                  </div>\n\n                  <div className="mb-4">\n                    <label className="block text-text-secondary mb-2">Destination Location</label>\n                    <input\n                      type="text"\n                      required\n                      value={formData.destination_location}\n                      onChange={e => setFormData({ ...formData, destination_location: e.target.value })}\n                      className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"\n                    />\n                  </div>\n\n                  <div className="mb-6">\n                    <label className="block text-text-secondary mb-2">Tracking Number (optional)</label>\n                    <input\n                      type="text"\n                      value={formData.tracking_number}\n                      onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}\n                      className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"\n                    />\n                  </div>\n\n                  <div className="flex gap-4">\n                    <button\n                      type="submit"\n                      disabled={createShipmentMutation.isPending}\n                      className="flex-1 bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"\n                    >\n                      {createShipmentMutation.isPending ? 'Creating...' : 'Create Shipment'}\n                    </button>\n                    <button\n                      type="button"\n                      onClick={() => setShowNewShipment(false)}\n                      className="flex-1 bg-dark-border text-text-secondary px-4 py-2 rounded font-bold hover:bg-dark transition"\n                    >\n                      Cancel\n                    </button>\n                  </div>\n                </form>\n              )}\n            </div>\n\n            {/* Shipments List */}\n            <div className="space-y-4">\n              {supplyData?.shipments.map((shipment: any) => (\n                <div key={shipment.id} className="bg-surface p-6 rounded-lg">\n                  <div className="flex justify-between items-start mb-4">\n                    <div>\n                      <p className="font-bold text-gold text-lg">{shipment.shipment_id}</p>\n                      <p className="text-text-secondary text-sm">{shipment.source.toUpperCase()} • {shipment.quantity} kits</p>\n                    </div>\n                    <div className={`px-3 py-1 rounded font-bold text-sm ${\n                      shipment.status === 'distributed' ? 'bg-green text-dark' :\n                      shipment.status === 'received' ? 'bg-gold text-dark' :\n                      shipment.status === 'in_transit' ? 'bg-blue text-dark' :\n                      'bg-dark-border text-text-secondary'\n                    }`}>\n                      {shipment.status.toUpperCase()}\n                    </div>\n                  </div>\n\n                  <div className="grid grid-cols-2 gap-4 text-sm">\n                    <div>\n                      <p className="text-text-secondary">From</p>\n                      <p className="text-text-primary font-bold">{shipment.origin_location}</p>\n                    </div>\n                    <div>\n                      <p className="text-text-secondary">To</p>\n                      <p className="text-text-primary font-bold">{shipment.destination_location}</p>\n                    </div>\n                  </div>\n\n                  {shipment.tracking_number && (\n                    <p className="text-text-secondary text-sm mt-3">\n                      Tracking: {shipment.tracking_number}\n                    </p>\n                  )}\n                </div>\n              ))}\n            </div>\n          </div>\n        )}\n\n        {/* Distribution Tab */}\n        {tab === 'distribution' && (\n          <div className="text-center py-12">\n            <p className="text-text-secondary text-lg">Distribution tracking coming soon.</p>\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n
