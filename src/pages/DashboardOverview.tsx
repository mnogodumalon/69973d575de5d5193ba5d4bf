import { useState, useMemo } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { ArtikelEinstellen } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { AI_PHOTO_SCAN, AI_PHOTO_LOCATION } from '@/config/ai-features';
import { ArtikelEinstellenDialog } from '@/components/dialogs/ArtikelEinstellenDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatCard } from '@/components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconAlertCircle,
  IconPlus,
  IconPencil,
  IconTrash,
  IconSearch,
  IconPackage,
  IconPhoto,
  IconPalette,
  IconRuler,
} from '@tabler/icons-react';

export default function DashboardOverview() {
  const { artikelEinstellen, loading, error, fetchAll } = useDashboardData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ArtikelEinstellen | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtikelEinstellen | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ArtikelEinstellen | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return artikelEinstellen;
    const q = search.toLowerCase();
    return artikelEinstellen.filter(a =>
      [a.fields.hersteller, a.fields.modell, a.fields.farbe, a.fields.groesse]
        .some(v => v?.toLowerCase().includes(q))
    );
  }, [artikelEinstellen, search]);

  const withPhotos = artikelEinstellen.filter(a => a.fields.foto).length;
  const uniqueBrands = new Set(artikelEinstellen.map(a => a.fields.hersteller).filter(Boolean)).size;

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} onRetry={fetchAll} />;

  function openCreate() {
    setEditRecord(null);
    setDialogOpen(true);
  }

  function openEdit(record: ArtikelEinstellen, e: React.MouseEvent) {
    e.stopPropagation();
    setEditRecord(record);
    setDialogOpen(true);
  }

  function openDelete(record: ArtikelEinstellen, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteTarget(record);
  }

  async function handleSubmit(fields: ArtikelEinstellen['fields']) {
    if (editRecord) {
      await LivingAppsService.updateArtikelEinstellenEntry(editRecord.record_id, fields);
    } else {
      await LivingAppsService.createArtikelEinstellenEntry(fields);
    }
    fetchAll();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await LivingAppsService.deleteArtikelEinstellenEntry(deleteTarget.record_id);
    fetchAll();
    if (selectedRecord?.record_id === deleteTarget.record_id) setSelectedRecord(null);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Artikel gesamt"
          value={String(artikelEinstellen.length)}
          description="Eingestellte Artikel"
          icon={<IconPackage size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Mit Foto"
          value={String(withPhotos)}
          description="Artikel mit Bild"
          icon={<IconPhoto size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Marken"
          value={String(uniqueBrands)}
          description="Verschiedene Hersteller"
          icon={<IconPackage size={18} className="text-muted-foreground" />}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0" />
          <Input
            placeholder="Hersteller, Modell, Farbe suchen…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <IconPlus size={16} className="mr-2 shrink-0" />
          Artikel einstellen
        </Button>
      </div>

      {/* Main content: grid + optional detail panel */}
      <div className="flex gap-6 items-start">
        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <IconPackage size={32} stroke={1.5} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Keine Artikel gefunden</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {search ? 'Suchbegriff anpassen oder Filter entfernen.' : 'Starte jetzt und stelle deinen ersten Artikel ein.'}
                </p>
              </div>
              {!search && (
                <Button onClick={openCreate}>
                  <IconPlus size={16} className="mr-2" />
                  Ersten Artikel einstellen
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(article => (
                <ArticleCard
                  key={article.record_id}
                  article={article}
                  selected={selectedRecord?.record_id === article.record_id}
                  onClick={() => setSelectedRecord(prev =>
                    prev?.record_id === article.record_id ? null : article
                  )}
                  onEdit={e => openEdit(article, e)}
                  onDelete={e => openDelete(article, e)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel (shown on lg+ when an article is selected) */}
        {selectedRecord && (
          <div className="hidden lg:block w-80 shrink-0">
            <ArticleDetail
              article={selectedRecord}
              onEdit={e => openEdit(selectedRecord, e)}
              onDelete={e => openDelete(selectedRecord, e)}
              onClose={() => setSelectedRecord(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile detail panel */}
      {selectedRecord && (
        <div className="lg:hidden">
          <ArticleDetail
            article={selectedRecord}
            onEdit={e => openEdit(selectedRecord, e)}
            onDelete={e => openDelete(selectedRecord, e)}
            onClose={() => setSelectedRecord(null)}
          />
        </div>
      )}

      <ArtikelEinstellenDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRecord(null); }}
        onSubmit={handleSubmit}
        defaultValues={editRecord?.fields}
        enablePhotoScan={AI_PHOTO_SCAN['ArtikelEinstellen']}
        enablePhotoLocation={AI_PHOTO_LOCATION['ArtikelEinstellen']}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Artikel löschen"
        description={`Soll "${[deleteTarget?.fields.hersteller, deleteTarget?.fields.modell].filter(Boolean).join(' ') || 'dieser Artikel'}" wirklich gelöscht werden?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function ArticleCard({
  article,
  selected,
  onClick,
  onEdit,
  onDelete,
}: {
  article: ArtikelEinstellen;
  selected: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const { foto, hersteller, modell, farbe, groesse } = article.fields;
  const title = [hersteller, modell].filter(Boolean).join(' ') || 'Unbenannt';

  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl bg-card overflow-hidden border cursor-pointer transition-all ${
        selected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/40 hover:shadow-md'
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {foto ? (
          <img
            src={foto}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconPhoto size={40} stroke={1.5} className="text-muted-foreground/40" />
          </div>
        )}
        {/* Action buttons — always visible, top-right */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm"
            title="Bearbeiten"
          >
            <IconPencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-destructive hover:bg-white transition-colors shadow-sm"
            title="Löschen"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="font-semibold text-sm leading-tight truncate text-foreground">{title}</p>
        <div className="flex flex-wrap gap-1">
          {farbe && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <IconPalette size={11} />
              <span className="truncate max-w-[60px]">{farbe}</span>
            </span>
          )}
          {groesse && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <IconRuler size={11} />
              <span>{groesse}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleDetail({
  article,
  onEdit,
  onDelete,
  onClose,
}: {
  article: ArtikelEinstellen;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onClose: () => void;
}) {
  const { foto, hersteller, modell, farbe, groesse } = article.fields;
  const title = [hersteller, modell].filter(Boolean).join(' ') || 'Unbenannt';

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
      {/* Photo */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {foto ? (
          <img
            src={foto}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconPhoto size={48} stroke={1.5} className="text-muted-foreground/30" />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">{title}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {hersteller && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Hersteller</p>
              <p className="text-sm font-semibold text-foreground truncate">{hersteller}</p>
            </div>
          )}
          {modell && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Modell</p>
              <p className="text-sm font-semibold text-foreground truncate">{modell}</p>
            </div>
          )}
          {farbe && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Farbe</p>
              <p className="text-sm font-semibold text-foreground">{farbe}</p>
            </div>
          )}
          {groesse && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Größe</p>
              <p className="text-sm font-semibold text-foreground">{groesse}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button className="flex-1" onClick={onEdit}>
            <IconPencil size={15} className="mr-2 shrink-0" />
            Bearbeiten
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive shrink-0">
            <IconTrash size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 max-w-sm rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
      </div>
    </div>
  );
}

function DashboardError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <IconAlertCircle size={22} className="text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">Fehler beim Laden</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{error.message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>Erneut versuchen</Button>
    </div>
  );
}
