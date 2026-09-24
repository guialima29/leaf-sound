"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { X } from "lucide-react";

interface WorkspaceCreateFormProp {
  onClick: () => void;
}

export function WorkspaceCreateForm({ onClick }: WorkspaceCreateFormProp) {
  const MAX_TITLE = 30;
  const { createWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await createWorkspace(name.trim(), description.trim() || undefined);
      onClick(); // Fecha o modal
    } catch (err) {
      console.error("Erro ao criar workspace:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-semibold">Criar Workspace</CardTitle>
        <CardAction className="-mt-1">
          <Button
            type="button"
            onClick={onClick}
            variant="link"
            className="bg-black text-white w-7 h-7 hover:scale-110 transition-all rounded-full"
          >
            <X className="w-4 h-4 rounded-full stroke-3" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-workspace">Nome</Label>
              <Input
                id="nome-workspace"
                type="text"
                placeholder="Ex: Teoria Musical, Canções..."
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_TITLE}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc-workspace">Descrição (opcional)</Label>
              <Input
                id="desc-workspace"
                type="text"
                placeholder="Ex: Estudos do 1º semestre"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={60}
              />
            </div>
          </div>
          <div className="flex-col gap-1 mt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Criando..." : "Criar Workspace"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
