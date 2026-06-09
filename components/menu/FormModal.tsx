'use client';

import { FormEvent, useState } from 'react';

export interface FormFieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number';
  required?: boolean;
  placeholder?: string;
}

export function FormModal({
  title,
  fields,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: FormFieldDef[];
  initial: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of fields) v[f.key] = initial[f.key] != null ? String(initial[f.key]) : '';
    return v;
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim()) {
        setError(`${f.label} is required.`);
        return;
      }
    }
    setBusy(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {fields.map((f) => (
            <label key={f.key} className="modal-field">
              <span className="modal-label">
                {f.label}
                {f.required && <span className="modal-required"> *</span>}
              </span>
              <input
                className="form-input"
                type={f.type === 'number' ? 'number' : 'text'}
                step={f.type === 'number' ? 'any' : undefined}
                placeholder={f.placeholder}
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            </label>
          ))}
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ConfirmModal({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed.');
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div className="modal modal-sm" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Confirm</h3>
          <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-form">
          <p className="modal-message">{message}</p>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={confirm} disabled={busy}>
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
