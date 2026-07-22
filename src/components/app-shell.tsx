import type { ReactNode } from "react";
import { Home, Maximize2, LayoutGrid } from "lucide-react";
import { useRouterState, Link } from "@tanstack/react-router";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const routeLabels: Record<string, string> = {
  "/": "工作台",
  "/companies": "公司管理",
  "/companies/list": "公司列表",
  "/apps": "应用管理",
  "/apps/products": "产品/App管理",
  "/apps/oauth-clients": "OAuth Client管理",
  "/accounts": "账号管理",
  "/accounts/list": "认证账号列表",
  "/audit": "审计日志",
  "/audit/logs": "日志管理",
  "/system": "系统管理",
  "/system/users": "后台系统用户管理",
  "/system/menus": "后台系统菜单管理",
  "/system/dict": "后台系统字典管理",
  "/system/departments": "后台系统部门管理",
  "/system/agreements": "协议与声明配置",
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = routeLabels[pathname] ?? "工作台";

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              <span>{title}</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="切换全屏">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="快捷菜单">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">A</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="border-b bg-background px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-1 border-b-2 border-primary pb-1.5 text-primary">
              <Home className="h-3.5 w-3.5" /> {title}
            </span>
          </div>
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <footer className="border-t bg-background py-3 text-center text-xs text-muted-foreground">
            2025 © Boo Identity Cloud
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
