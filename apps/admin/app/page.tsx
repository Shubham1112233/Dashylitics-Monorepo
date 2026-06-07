'use client';

import { useEffect, useState } from 'react';
import type { DateRange } from '@/lib/schemas/stats';

type SnapshotRow = {
  range: DateRange;
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  deltas: {
    revenuePercent: number;
    usersPercent: number;
    ordersPercent: number;
  };
};

type EditForm = Omit<SnapshotRow, 'range'>;

const rangeLabels: Record<DateRange, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percent = (value: number) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

const emptyForm: EditForm = {
  totalRevenue: 0,
  totalUsers: 0,
  totalOrders: 0,
  deltas: {
    revenuePercent: 0,
    usersPercent: 0,
    ordersPercent: 0,
  },
};

const customerAppUrl =
  process.env.NEXT_PUBLIC_CUSTOMER_APP_URL ?? 'http://localhost:3000';

export default function AdminPage() {
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [editing, setEditing] = useState<DateRange | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadSnapshots() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/snapshots');
      if (!res.ok) throw new Error('Failed to load snapshots');

      const data = (await res.json()) as SnapshotRow[];
      setSnapshots(data);
    } catch {
      setError('Could not load snapshots. Is the database running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSnapshots();
  }, []);

  function startEdit(row: SnapshotRow) {
    setEditing(row.range);
    setForm({
      totalRevenue: row.totalRevenue,
      totalUsers: row.totalUsers,
      totalOrders: row.totalOrders,
      deltas: { ...row.deltas },
    });
    setMessage(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  function updateNumber(
    field: 'totalRevenue' | 'totalUsers' | 'totalOrders',
    value: string
  ) {
    const num = value === '' ? 0 : Number(value);
    setForm((prev) => ({ ...prev, [field]: num }));
  }

  function updateDelta(
    field: 'revenuePercent' | 'usersPercent' | 'ordersPercent',
    value: string
  ) {
    const num = value === '' ? 0 : Number(value);
    setForm((prev) => ({
      ...prev,
      deltas: { ...prev.deltas, [field]: num },
    }));
  }

  async function saveEdit() {
    if (!editing) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/snapshots/${editing}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Save failed');
      }

      setMessage(
        `Saved ${rangeLabels[editing]} successfully. Please check the customer dashboard for the updated result.`
      );
      cancelEdit();
      await loadSnapshots();
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Could not save changes';
      setMessage(text);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Dashlytics Admin
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Edit KPI totals and deltas. Chart bars are unchanged in v1.
            </p>
          </div>

          <a
            href={customerAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-violet-700 shadow-sm transition hover:bg-zinc-50"
          >
            View customer dashboard →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading && (
          <p className="text-sm text-zinc-500">Loading snapshots…</p>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.includes('success')
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
          >
            {message}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Range
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Users
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Rev Δ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Users Δ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">
                    Orders Δ
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {snapshots.map((row) => (
                  <tr key={row.range} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {rangeLabels[row.range]}
                    </td>
                    <td className="px-4 py-3">{currency.format(row.totalRevenue)}</td>
                    <td className="px-4 py-3">
                      {row.totalUsers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {row.totalOrders.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{percent(row.deltas.revenuePercent)}</td>
                    <td className="px-4 py-3">{percent(row.deltas.usersPercent)}</td>
                    <td className="px-4 py-3">{percent(row.deltas.ordersPercent)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Edit {rangeLabels[editing]}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Changes apply to stat cards on the customer dashboard.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Total revenue</span>
                <input
                  type="number"
                  value={form.totalRevenue}
                  onChange={(e) => updateNumber('totalRevenue', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Total users</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.totalUsers}
                  onChange={(e) => updateNumber('totalUsers', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Total orders</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.totalOrders}
                  onChange={(e) => updateNumber('totalOrders', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Revenue delta %</span>
                <input
                  type="number"
                  step={0.1}
                  value={form.deltas.revenuePercent}
                  onChange={(e) => updateDelta('revenuePercent', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Users delta %</span>
                <input
                  type="number"
                  step={0.1}
                  value={form.deltas.usersPercent}
                  onChange={(e) => updateDelta('usersPercent', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Orders delta %</span>
                <input
                  type="number"
                  step={0.1}
                  value={form.deltas.ordersPercent}
                  onChange={(e) => updateDelta('ordersPercent', e.target.value)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-violet-500/30 focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}