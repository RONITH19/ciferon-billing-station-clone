'use client';

import { FormEvent, useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import { apiGetSettings, apiSaveSettings } from '@/lib/api-client';

const FIELDS: { key: string; label: string }[] = [
  { key: 'restaurantName', label: 'Restaurant Name' },
  { key: 'currency', label: 'Currency' },
  { key: 'taxRate', label: 'Tax Rate (%)' },
  { key: 'gstNumber', label: 'GST Number' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetSettings()
      .then((v) => setValues(v))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    setError('');
    try {
      const updated = await apiSaveSettings(values);
      setValues(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-body" data-page="settings">
        <DashboardShell title="Settings">
          <main className="dashboard-content section-content">
            <div className="settings-card">
              <h2 className="data-panel-title">Restaurant Settings</h2>
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner" aria-label="Loading" />
                </div>
              ) : (
                <form className="settings-form" onSubmit={handleSubmit}>
                  {FIELDS.map((f) => (
                    <label key={f.key} className="modal-field">
                      <span className="modal-label">{f.label}</span>
                      <input
                        className="form-input"
                        value={values[f.key] ?? ''}
                        onChange={(e) => {
                          setValues((v) => ({ ...v, [f.key]: e.target.value }));
                          setSaved(false);
                        }}
                      />
                    </label>
                  ))}
                  {error && <p className="form-error">{error}</p>}
                  {saved && <p className="form-hint">Settings saved.</p>}
                  <div className="modal-actions">
                    <button type="submit" className="btn-primary" disabled={busy}>
                      {busy ? 'Saving…' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </DashboardShell>
      </div>
    </AuthGuard>
  );
}
