import { useState, useEffect, useMemo } from 'react';
import type { ArtikelEinstellen } from '@/types/app';
import { LivingAppsService, type ImageAnalysisResult } from '@/services/livingAppsService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Package, AlertCircle, ImageOff, Sparkles, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Form data type
interface ArtikelFormData {
  hersteller: string;
  modell: string;
  farbe: string;
  groesse: string;
}

// Article Dialog Component (Create/Edit)
function ArtikelDialog({
  open,
  onOpenChange,
  artikel,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artikel?: ArtikelEinstellen | null;
  onSuccess: () => void;
}) {
  const isEditing = !!artikel;
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtikelFormData>({
    hersteller: '',
    modell: '',
    farbe: '',
    groesse: '',
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        hersteller: artikel?.fields.hersteller ?? '',
        modell: artikel?.fields.modell ?? '',
        farbe: artikel?.fields.farbe ?? '',
        groesse: artikel?.fields.groesse ?? '',
      });
      setImagePreview(artikel?.fields.foto ?? null);
    } else {
      setImagePreview(null);
    }
  }, [open, artikel]);

  // Handle image selection and AI analysis
  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Full = event.target?.result as string;
      setImagePreview(base64Full);

      // Extract just the base64 data (remove data:image/...;base64, prefix)
      const base64Data = base64Full.split(',')[1];

      // Analyze with AI
      setAnalyzing(true);
      toast.info('Analysiere Bild mit KI...');

      try {
        const result = await LivingAppsService.analyzeImage(base64Data);
        setFormData((prev) => ({
          hersteller: result.hersteller || prev.hersteller,
          modell: result.modell || prev.modell,
          farbe: result.farbe || prev.farbe,
          groesse: result.groesse || prev.groesse,
        }));
        toast.success('Felder automatisch ausgefüllt!');
      } catch (err) {
        toast.error('KI-Analyse fehlgeschlagen. Bitte manuell ausfüllen.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && artikel) {
        await LivingAppsService.updateArtikelEinstellenEntry(artikel.record_id, formData);
        toast.success('Artikel aktualisiert');
      } else {
        await LivingAppsService.createArtikelEinstellenEntry(formData);
        toast.success('Artikel eingestellt');
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(
        `Fehler beim ${isEditing ? 'Speichern' : 'Erstellen'}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Artikel bearbeiten' : 'Artikel einstellen'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload with AI Magic */}
          <div className="space-y-2">
            <Label>Foto (KI füllt Felder automatisch aus)</Label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={analyzing}
              />
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  imagePreview ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vorschau"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {analyzing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm font-medium">Analysiere...</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Foto hochladen</p>
                      <p className="text-xs">KI erkennt Hersteller, Modell, Farbe & Größe</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hersteller">Hersteller</Label>
            <Input
              id="hersteller"
              value={formData.hersteller}
              onChange={(e) => setFormData((prev) => ({ ...prev, hersteller: e.target.value }))}
              placeholder="z.B. Nike, Apple, Samsung"
              disabled={analyzing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modell">Modell</Label>
            <Input
              id="modell"
              value={formData.modell}
              onChange={(e) => setFormData((prev) => ({ ...prev, modell: e.target.value }))}
              placeholder="z.B. Air Max, iPhone 14"
              disabled={analyzing}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farbe">Farbe</Label>
              <Input
                id="farbe"
                value={formData.farbe}
                onChange={(e) => setFormData((prev) => ({ ...prev, farbe: e.target.value }))}
                placeholder="z.B. Schwarz"
                disabled={analyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groesse">Größe</Label>
              <Input
                id="groesse"
                value={formData.groesse}
                onChange={(e) => setFormData((prev) => ({ ...prev, groesse: e.target.value }))}
                placeholder="z.B. M, 42, XL"
                disabled={analyzing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting || analyzing}>
              {submitting ? 'Speichert...' : isEditing ? 'Speichern' : 'Einstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteDialog({
  open,
  onOpenChange,
  artikel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artikel: ArtikelEinstellen | null;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error handled in parent
    } finally {
      setDeleting(false);
    }
  }

  const artikelName = artikel
    ? [artikel.fields.hersteller, artikel.fields.modell].filter(Boolean).join(' ') || 'Artikel'
    : 'Artikel';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Artikel löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Möchtest du "{artikelName}" wirklich löschen? Diese Aktion kann nicht rückgängig
            gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? 'Löscht...' : 'Löschen'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Detail Dialog
function DetailDialog({
  open,
  onOpenChange,
  artikel,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artikel: ArtikelEinstellen | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!artikel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Artikeldetails</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image placeholder */}
          <div className="aspect-video w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            {artikel.fields.foto ? (
              <img
                src={artikel.fields.foto}
                alt={artikel.fields.modell || 'Artikel'}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageOff className="h-12 w-12 text-orange-400" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            {artikel.fields.hersteller && (
              <div>
                <p className="text-sm text-muted-foreground">Hersteller</p>
                <p className="font-medium">{artikel.fields.hersteller}</p>
              </div>
            )}
            {artikel.fields.modell && (
              <div>
                <p className="text-sm text-muted-foreground">Modell</p>
                <p className="font-medium">{artikel.fields.modell}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {artikel.fields.farbe && (
                <div>
                  <p className="text-sm text-muted-foreground">Farbe</p>
                  <p className="font-medium">{artikel.fields.farbe}</p>
                </div>
              )}
              {artikel.fields.groesse && (
                <div>
                  <p className="text-sm text-muted-foreground">Größe</p>
                  <p className="font-medium">{artikel.fields.groesse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Bearbeiten
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Article Card Component
function ArtikelCard({
  artikel,
  onView,
  onEdit,
  onDelete,
  index,
}: {
  artikel: ArtikelEinstellen;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  const artikelName =
    [artikel.fields.hersteller, artikel.fields.modell].filter(Boolean).join(' ') || 'Artikel';
  const details = [artikel.fields.farbe, artikel.fields.groesse].filter(Boolean).join(' • ');

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onView}
    >
      {/* Image area */}
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center relative">
        {artikel.fields.foto ? (
          <img
            src={artikel.fields.foto}
            alt={artikelName}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="h-8 w-8 text-orange-300" />
        )}

        {/* Hover actions - Desktop */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors hidden md:flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white shadow"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white shadow text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium truncate">{artikelName}</h3>
        {details && <p className="text-sm text-muted-foreground truncate">{details}</p>}
      </CardContent>
    </Card>
  );
}

// Mobile Article Card
function MobileArtikelCard({
  artikel,
  onView,
}: {
  artikel: ArtikelEinstellen;
  onView: () => void;
}) {
  const artikelName =
    [artikel.fields.hersteller, artikel.fields.modell].filter(Boolean).join(' ') || 'Artikel';
  const details = [artikel.fields.farbe, artikel.fields.groesse].filter(Boolean).join(' • ');

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      onClick={onView}
    >
      <CardContent className="p-3 flex gap-3">
        {/* Thumbnail */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {artikel.fields.foto ? (
            <img
              src={artikel.fields.foto}
              alt={artikelName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <ImageOff className="h-6 w-6 text-orange-300" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{artikelName}</h3>
          {details && <p className="text-sm text-muted-foreground truncate">{details}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-36 hidden md:block" />
      </div>

      {/* Hero skeleton */}
      <Skeleton className="h-28 w-full mb-6 rounded-lg" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Empty State
function EmptyArtikelState({ onAdd }: { onAdd: () => void }) {
  return (
    <Empty className="min-h-[400px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>Noch keine Artikel</EmptyTitle>
        <EmptyDescription>
          Beginne jetzt mit dem Verkauf und stelle deinen ersten Artikel ein.
        </EmptyDescription>
      </EmptyHeader>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Ersten Artikel einstellen
      </Button>
    </Empty>
  );
}

// Error State
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message}
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 w-full">
            Erneut versuchen
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [artikel, setArtikel] = useState<ArtikelEinstellen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editArtikel, setEditArtikel] = useState<ArtikelEinstellen | null>(null);
  const [deleteArtikel, setDeleteArtikel] = useState<ArtikelEinstellen | null>(null);
  const [viewArtikel, setViewArtikel] = useState<ArtikelEinstellen | null>(null);

  // Fetch data
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const data = await LivingAppsService.getArtikelEinstellen();
      // Sort by createdat descending (newest first)
      const sorted = data.sort(
        (a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
      );
      setArtikel(sorted);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  async function handleDelete() {
    if (!deleteArtikel) return;
    try {
      await LivingAppsService.deleteArtikelEinstellenEntry(deleteArtikel.record_id);
      toast.success('Artikel gelöscht');
      setDeleteArtikel(null);
      fetchData();
    } catch (err) {
      toast.error(
        `Fehler beim Löschen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      );
      throw err;
    }
  }

  // Statistics
  const stats = useMemo(() => {
    const herstellerCount = new Map<string, number>();
    artikel.forEach((a) => {
      const h = a.fields.hersteller || 'Unbekannt';
      herstellerCount.set(h, (herstellerCount.get(h) || 0) + 1);
    });
    return {
      total: artikel.length,
      topHersteller: Array.from(herstellerCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    };
  }, [artikel]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mein Marktplatz</h1>
          <Button onClick={() => setShowCreateDialog(true)} className="hidden md:flex">
            <Plus className="h-4 w-4 mr-2" />
            Artikel einstellen
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Hero KPI */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="py-6 text-center">
            <div className="text-5xl md:text-6xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-1">Artikel eingestellt</p>
          </CardContent>
        </Card>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main Content - Article Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Meine Artikel</h2>
              <span className="text-sm text-muted-foreground">{stats.total} Einträge</span>
            </div>

            {artikel.length === 0 ? (
              <EmptyArtikelState onAdd={() => setShowCreateDialog(true)} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {artikel.map((a, index) => (
                  <ArtikelCard
                    key={a.record_id}
                    artikel={a}
                    index={index}
                    onView={() => setViewArtikel(a)}
                    onEdit={() => setEditArtikel(a)}
                    onDelete={() => setDeleteArtikel(a)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Statistics */}
          <aside className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Top Hersteller</h3>
                {stats.topHersteller.length > 0 ? (
                  <ul className="space-y-2">
                    {stats.topHersteller.map(([name, count]) => (
                      <li key={name} className="flex justify-between text-sm">
                        <span className="truncate">{name}</span>
                        <span className="text-muted-foreground ml-2">{count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Noch keine Daten</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Meine Artikel</h2>
            <span className="text-sm text-muted-foreground">{stats.total}</span>
          </div>

          {artikel.length === 0 ? (
            <EmptyArtikelState onAdd={() => setShowCreateDialog(true)} />
          ) : (
            <div className="space-y-3">
              {artikel.map((a) => (
                <MobileArtikelCard key={a.record_id} artikel={a} onView={() => setViewArtikel(a)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FAB - Mobile */}
      <Button
        size="lg"
        className="md:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setShowCreateDialog(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create/Edit Dialog */}
      <ArtikelDialog
        open={showCreateDialog || !!editArtikel}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditArtikel(null);
          }
        }}
        artikel={editArtikel}
        onSuccess={fetchData}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteArtikel}
        onOpenChange={(open) => {
          if (!open) setDeleteArtikel(null);
        }}
        artikel={deleteArtikel}
        onConfirm={handleDelete}
      />

      {/* Detail Dialog */}
      <DetailDialog
        open={!!viewArtikel}
        onOpenChange={(open) => {
          if (!open) setViewArtikel(null);
        }}
        artikel={viewArtikel}
        onEdit={() => {
          setEditArtikel(viewArtikel);
          setViewArtikel(null);
        }}
        onDelete={() => {
          setDeleteArtikel(viewArtikel);
          setViewArtikel(null);
        }}
      />
    </div>
  );
}
