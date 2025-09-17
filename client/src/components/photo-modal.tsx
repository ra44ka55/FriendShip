import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Photo } from "@shared/schema";

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="relative">
          <img
            src={`/uploads/${photo.filename}`}
            alt={photo.caption || photo.originalName}
            className="w-full h-auto max-h-[80vh] object-contain"
            data-testid="img-photo-modal"
          />
          
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
            data-testid="button-close-photo-modal"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>
        
        {(photo.caption || photo.uploadedBy) && (
          <div className="p-6 border-t">
            {photo.caption && (
              <h3 className="text-lg font-semibold mb-2" data-testid="text-photo-modal-caption">
                {photo.caption}
              </h3>
            )}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span data-testid="text-photo-modal-uploaded-by">
                Uploaded by {photo.uploadedBy}
              </span>
              <span data-testid="text-photo-modal-date">
                {new Date(photo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
