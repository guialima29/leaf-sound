"use client";

import * as React from "react";
import { Suspense } from "react";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { NavWorkspaceTree } from "@/components/nav-workspace-tree";
import { SidebarQuickActions } from "@/components/sidebar-quick-actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const defaultUserData = {
  name: "Músico",
  email: "estudos@leafsound.com",
  avatar: "/avatars/user.jpg",
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onCreateWorkspace?: () => void;
}

export function AppSidebar({ onCreateWorkspace, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher handleCreateWorkspace={onCreateWorkspace} />
      </SidebarHeader>

      <SidebarContent>
        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Carregando notas...</div>}>
          <NavWorkspaceTree />
        </Suspense>
      </SidebarContent>

      <SidebarFooter className="p-0 gap-0">
        <SidebarQuickActions />
        <div className="p-2">
          <NavUser user={defaultUserData} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
