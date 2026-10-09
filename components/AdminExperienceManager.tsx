"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { regions, type RegionKey, type Experience } from "@/data/experiences";

const regionOrder: RegionKey[] = ["lyon", "paris", "londres", "abidjan"];

type FormState = {
  role: string;
  company: string;
  location: string;
  region: RegionKey;
  period: string;
  isCurrent: boolean;
  missions: string;
  stack: string;
};

const emptyForm: FormState = {
  role: "",
  company: "",
  location: "",
  region: "lyon",
  period: "",
  isCurrent: false,
  missions: "",
  stack: "",
};

function toFormState(exp: Experience): FormState {
  return {
    role: exp.role,
    company: exp.company,
    location: exp.location,
    region: exp.region,
    period: exp.period,
    isCurrent: Boolean(exp.current),
    missions: exp.missions.join("\n"),
    stack: exp.stack.join("\n"),
  };
}

export function AdminExperienceManager({ initialItems }: { initialItems: Experience[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId("new");
    setError("");
  };
  const startEdit = (exp: Experience) => {
    setForm(toFormState(exp));
    setEditingId(exp.id);
    setError("");
  };
  const cancel = () => {
    setEditingId(null);
    setError("");
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    const payload = {
      role: form.role,
      company: form.company,
      location: form.location,
      region: form.region,
      period: form.period,
      isCurrent: form.isCurrent,
      missions: form.missions,
      stack: form.stack,
    };
    try {
      const res = await fetch(
        editingId === "new" ? "/api/admin/experiences" : `/api/admin/experiences/${editingId}`,
        {
          method: editingId === "new" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Échec de l'enregistrement.");
        return;
      }
      setEditingId(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement cette expérience ?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const move = async (id: string, direction: "up" | "down") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move", direction }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const Form = (
    <div className="rounded-xl border border-accent-cyan/30 bg-bg-surface p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className="text-xs font-medium text-ink-secondary">Poste</span>
          <input
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">Entreprise</span>
          <input
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">Lieu (texte affiché)</span>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="ex: Lyon, France (à distance)"
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/50 focus:border-accent-cyan/50 focus:outline-none"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">
            Zone géographique (globe)
          </span>
          <select
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as RegionKey }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
          >
            {regionOrder.map((key) => (
              <option key={key} value={key}>
                {regions[key].label} ({regions[key].country})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">Période</span>
          <input
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            placeholder="ex: Jan. 2025 — Sept. 2025 · Alternance"
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/50 focus:border-accent-cyan/50 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-secondary">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => setForm((f) => ({ ...f, isCurrent: e.target.checked }))}
            className="h-4 w-4 rounded border-white/20 bg-bg-primary accent-accent-cyan"
          />
          Poste actuel (badge « En cours »)
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-ink-secondary">Missions (une par ligne)</span>
        <textarea
          value={form.missions}
          onChange={(e) => setForm((f) => ({ ...f, missions: e.target.value }))}
          rows={4}
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-ink-secondary">
          Compétences / stack (une par ligne)
        </span>
        <textarea
          value={form.stack}
          onChange={(e) => setForm((f) => ({ ...f, stack: e.target.value }))}
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={cancel}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="rounded-lg bg-signature-gradient px-4 py-2 text-sm font-semibold text-bg-primary disabled:opacity-40"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-8 flex flex-col gap-4">
      {editingId === "new" ? (
        Form
      ) : (
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-accent-cyan/40 px-4 py-2 text-sm font-medium text-accent-cyan hover:bg-accent-cyan/10"
        >
          <Plus size={16} /> Ajouter une expérience
        </button>
      )}

      {initialItems.map((exp, i) => (
        <div key={exp.id}>
          {editingId === exp.id ? (
            Form
          ) : (
            <div className="rounded-xl border border-white/5 bg-bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-sm font-semibold text-ink-primary">
                    {exp.role} — {exp.company}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {exp.location} · {regions[exp.region].label} · {exp.period}
                    {exp.current && (
                      <span className="ml-2 text-accent-emerald">● En cours</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={i === 0 || busyId === exp.id}
                    onClick={() => move(exp.id, "up")}
                    aria-label="Monter"
                    className="rounded-lg p-1.5 text-ink-secondary hover:text-ink-primary disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={i === initialItems.length - 1 || busyId === exp.id}
                    onClick={() => move(exp.id, "down")}
                    aria-label="Descendre"
                    className="rounded-lg p-1.5 text-ink-secondary hover:text-ink-primary disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(exp)}
                    aria-label="Modifier"
                    className="rounded-lg p-1.5 text-ink-secondary hover:text-accent-cyan"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={busyId === exp.id}
                    onClick={() => remove(exp.id)}
                    aria-label="Supprimer"
                    className="rounded-lg p-1.5 text-ink-secondary hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {initialItems.length === 0 && editingId !== "new" && (
        <p className="text-sm text-ink-secondary">Aucune expérience pour l&apos;instant.</p>
      )}
    </div>
  );
}
