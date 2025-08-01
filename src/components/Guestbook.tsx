import React, { useState, useEffect } from 'react';
import './Guestbook.scss';

interface GuestbookEntry {
  id: number;
  name: string;
  message?: string;
  created_at: string;
}

const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/guestbook');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), message: message.trim() || null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add entry');
      }

      setName('');
      setMessage('');
      await fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="guestbook">
      <div className="guestbook-container">
        <h2 className="guestbook-title">sign the guestbook</h2>
        
        <form onSubmit={handleSubmit} className="guestbook-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              className="neon-input"
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="leave a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              className="neon-textarea"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading || !name.trim()} className="neon-button">
            {loading ? 'signing...' : 'sign guestbook'}
          </button>
        </form>

        <div className="entries-section">
          <h3 className="entries-title">recent signatures</h3>
          <div className="entries-list">
            {entries.length === 0 ? (
              <div className="no-entries">be the first to sign!</div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="entry">
                  <div className="entry-header">
                    <span className="entry-name">{entry.name}</span>
                    <span className="entry-date">{formatDate(entry.created_at)}</span>
                  </div>
                  {entry.message && (
                    <div className="entry-message">{entry.message}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;