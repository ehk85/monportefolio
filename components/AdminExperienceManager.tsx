"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, Search, Globe2 } from "lucide-react";
import { contractTypes, type Experience } from "@/data/experiences";
import type { Region } from "@/data/region";

type FormState = {
  role: string;
  company: string;
  location: string;
  region: string;
  period: string;
  contractType: string;
  isCurrent: boolean;
  missions: string;
  stack: string;
};

function createEmptyForm(regions: Region[]): FormState {
  return {
    role: "",
    company: "",
    location: "",
    region: regions[0]?.key ?? "",
    period: "",
    contractType: "",
    isCurrent: false,
    missions: "",
    stack: "",
  };
}

function toFormState(exp: Experience): FormState {
  return {
    role: exp.role,
    company: exp.company,
    location: exp.location,
    region: exp.region,
    period: exp.period,
    contractType: exp.contractType ?? "",
    isCurrent: Boolean(exp.current),
    missions: exp.missions.join("\n"),
    stack: exp.stack.join("\n"),
  };
}

type CityPreview = {
  label: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
};

export function AdminExperienceManager({
  initialItems,
  regions,
}: {
  initialItems: Experience[];
  regions: Region[];
}) {
  const router = useRouter();
  const [localRegions, setLocalRegions] = useState<Region[]>(regions);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(() => createEmptyForm(regions));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [cityPanelOpen, setCityPanelOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [cityPreview, setCityPreview] = useState<CityPreview | null>(null);
  const [citySearching, setCitySearching] = useState(false);
  const [cityGenerating, setCityGenerating] = useState(false);
  const [cityError, setCityError] = useState("");

  useEffect(() => {
    setLocalRegions(regions);
  }, [regions]);

  const regionsByKey: Record<string, Region> = {};
  for (const r of localRegions) regionsByKey[r.key] = r;

  const startCreate = () => {
    setForm(createEmptyForm(localRegions));
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
      contractType: form.contractType,
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

  const openCityPanel = () => {
    setCityPanelOpen(true);
    setCityQuery("");
    setCityPreview(null);
    setCityError("");
  };
  const closeCityPanel = () => {
    setCityPanelOpen(false);
    setCityQuery("");
    setCityPreview(null);
    setCityError("");
  };

  const searchCity = async () => {
    setCitySearching(true);
    setCityError("");
    setCityPreview(null);
    try {
      const res = await fetch("/api/admin/regions/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cityQuery }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCityError(body.error || "Échec de la recherche.");
        return;
      }
      setCityPreview(body);
    } finally {
      setCitySearching(false);
    }
  };

  const confirmCity = async () => {
    if (!cityPreview) return;
    setCityGenerating(true);
    setCityError("");
    try {
      const res = await fetch("/api/admin/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityPreview),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCityError(body.error || "Échec de la génération.");
        return;
      }
      const newRegion: Region = {
        key: body.key,
        label: cityPreview.label,
        country: cityPreview.country,
        countryCode: cityPreview.countryCode,
        lat: cityPreview.lat,
        lng: cityPreview.lng,
        mapX: 0,
        mapY: 0,
      };
      setLocalRegions((prev) => [...prev, newRegion]);
      setForm((f) => ({ ...f, region: newRegion.key }));
      closeCityPanel();
      router.refresh();
    } finally {
      setCityGenerating(false);
    }
  };

  const CityPanel = (
    <div className="mt-2 rounded-lg border border-accent-emerald/30 bg-bg-primary p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium text-accent-emerald">
        <Globe2 size={14} /> Ajouter une nouvelle ville
      </p>
      <p className="mt-1 text-xs text-ink-secondary">
        Recherche une ville ; sa carte de pays sera générée automatiquement si elle n&apos;existe
        pas encore (frontières réelles, projection sur le globe).
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              searchCity();
            }
          }}
          placeholder="ex: Madrid, Espagne"
          className="flex-1 rounded-lg border border-white/10 bg-bg-surface px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/50 focus:border-accent-emerald/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={searchCity}
          disabled={citySearching || cityQuery.trim().length < 2}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent-emerald/40 px-3 py-2 text-sm font-medium text-accent-emerald hover:bg-accent-emerald/10 disabled:opacity-40"
        >
          <Search size={14} /> {citySearching ? "Recherche…" : "Rechercher"}
        </button>
      </div>

      {cityError && <p className="mt-2 text-sm text-red-400">{cityError}</p>}

      {cityPreview && (
        <div className="mt-3 rounded-lg border border-white/10 bg-bg-surface p-3">
          <p className="text-sm text-ink-primary">
            {cityPreview.label}, {cityPreview.country}{" "}
            <span className="text-ink-secondary">({cityPreview.countryCode.toUpperCase()})</span>
          </p>
          <p className="mt-0.5 text-xs text-ink-secondary">
            lat {cityPreview.lat.toFixed(3)} / lng {cityPreview.lng.toFixed(3)}
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeCityPanel}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-ink-secondary hover:text-ink-primary"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmCity}
              disabled={cityGenerating}
              className="rounded-lg bg-signature-gradient px-3 py-1.5 text-xs font-semibold text-bg-primary disabled:opacity-40"
            >
              {cityGenerating ? "Génération de la carte…" : "Confirmer et générer la carte"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
          <div className="mt-1 flex gap-2">
            <select
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
            >
              {localRegions.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label} ({r.country})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={openCityPanel}
              title="Ajouter une nouvelle ville"
              className="shrink-0 rounded-lg border border-accent-emerald/40 px-2.5 text-accent-emerald hover:bg-accent-emerald/10"
            >
              <Plus size={16} />
            </button>
          </div>
          {cityPanelOpen && CityPanel}
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">Période</span>
          <input
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            placeholder="ex: Jan. 2025 — Sept. 2025"
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/50 focus:border-accent-cyan/50 focus:outline-none"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-ink-secondary">Type de contrat</span>
          <select
            value={form.contractType}
            onChange={(e) => setForm((f) => ({ ...f, contractType: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
          >
            <option value="">— Aucun —</option>
            {contractTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
                    {exp.location} · {regionsByKey[exp.region]?.label ?? exp.region} · {exp.period}
                    {exp.contractType && ` · ${exp.contractType}`}
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
