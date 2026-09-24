"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Section } from "@/types/workspace";
import { FolderSymlink, Trash2, AlertTriangle } from "lucide-react";

interface SectionDeleteDialogProps {
  isOpen: boolean;
  section: Section | null;
  notesCount: number;
  onClose: () => void;
  onConfirm: (moveNotesToRoot: boolean) => Promise<void>;
}

export function SectionDeleteDialog({
  isOpen,
  section,
  notesCount,
  onClose,
  onConfirm,
}: SectionDeleteDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!section) return null;

  const handleAction = async (moveNotesToRoot: boolean) => {
    try {
      setIsProcessing(true);
      await onConfirm(moveNotesToRoot);
      onClose();
    } catch (err) {
      console.error("Erro ao excluir seção:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasNotes = notesCount > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="size-5 shrink-0" />
            <DialogTitle>Excluir Seção &quot;{section.name}&quot;?</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            {hasNotes
              ? `Esta seção possui ${notesCount} ${notesCount === 1 ? "nota vinculada" : "notas vinculadas"}. Escolha como deseja tratar o conteúdo antes de excluir a seção:`
              : "Esta seção não possui nenhuma nota e será excluída permanentemente."}
          </DialogDescription>
        </DialogHeader>

        {hasNotes ? (
          <div className="flex flex-col gap-3 py-2">
            {/* OPÇÃO 1: Mover para a raiz */}
            <button
              type="button"
              onClick={() => handleAction(true)}
              disabled={isProcessing}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-sidebar-accent/50 hover:bg-sidebar-accent hover:border-primary/50 text-left transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <FolderSymlink className="size-4" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  Mover notas para a raiz e excluir seção
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recomendado: suas notas serão preservadas na seção &quot;Notas Gerais&quot; da workspace.
                </p>
              </div>
            </button>

            {/* OPÇÃO 2: Excluir tudo */}
            <button
              type="button"
              onClick={() => handleAction(false)}
              disabled={isProcessing}
              className="flex items-start gap-3 p-3 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/40 hover:border-red-400 text-left transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-md bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Trash2 className="size-4" />
              </div>
              <div>
                <p className="font-medium text-sm text-red-600 dark:text-red-400">
                  Excluir a seção e todas as {notesCount} notas
                </p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                  Atenção: todas as notas contidas nesta seção serão apagadas definitivamente.
                </p>
              </div>
            </button>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>

          {!hasNotes && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleAction(false)}
              disabled={isProcessing}
            >
              {isProcessing ? "Excluindo..." : "Excluir Seção"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

