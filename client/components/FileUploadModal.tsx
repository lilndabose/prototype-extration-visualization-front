import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, dateCreation?: string) => Promise<void>;
  loading?: boolean;
}

export function FileUploadModal({
  open,
  onOpenChange,
  onUpload,
  loading = false,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dateCreation, setDateCreation] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onUpload(selectedFile, dateCreation);
      setSelectedFile(null);
      setDateCreation(new Date().toISOString().split('T')[0]);
      onOpenChange(false);
      toast({
        title: 'Succès',
        description: 'Fichier uploadé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Uploader un fichier</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier Excel ou CSV à uploader
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="file-input" className="text-sm font-medium">
              Fichier
            </label>
            <Input
              id="file-input"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              disabled={loading}
              className="flex-1"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="date-input" className="text-sm font-medium">
              Date de création
            </label>
            <Input
              id="date-input"
              type="date"
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="bg-gradient-to-r from-te-red to-te-orange"
          >
            {loading ? 'Uploading...' : 'Uploader'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
