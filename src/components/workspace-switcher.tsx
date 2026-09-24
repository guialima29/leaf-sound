"use client";

import * as React from "react";
import { Check, ChevronsUpDown, FolderKanban, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/workspace-context";

interface WorkspaceSwitcherProp {
  handleCreateWorkspace?: () => void;
}

export function WorkspaceSwitcher({ handleCreateWorkspace }: WorkspaceSwitcherProp) {
  const { isMobile } = useSidebar();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();

  if (!activeWorkspace && workspaces.length === 0) {
    return null;
  }

  const currentWorkspace = activeWorkspace || workspaces[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-sm">
                {currentWorkspace?.name ? currentWorkspace.name.substring(0, 2).toUpperCase() : <FolderKanban className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentWorkspace?.name || "Workspace"}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentWorkspace?.description || "Espaço de notas"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Minhas Workspaces
            </DropdownMenuLabel>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => switchWorkspace(ws.id)}
                className="gap-2 p-2 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="flex size-6 items-center justify-center rounded-md border text-xs font-medium bg-muted">
                    {ws.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate">{ws.name}</span>
                </div>
                {currentWorkspace?.id === ws.id && (
                  <Check className="size-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCreateWorkspace}
              className="gap-2 p-2 cursor-pointer font-medium text-primary hover:text-primary"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div>Criar Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
