import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  LayoutGrid,
  UserCircle2,
  FileText,
  Settings,
  List,
  Boxes,
  KeyRound,
  UserSquare2,
  ScrollText,
  Users,
  Menu as MenuIcon,
  BookMarked,
  Network,
  FileSignature,
  Cloud,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
};

const menu: MenuItem[] = [
  { title: "工作台", url: "/", icon: LayoutDashboard },
  {
    title: "公司管理",
    url: "/companies",
    icon: Building2,
    children: [{ title: "公司列表", url: "/companies/list", icon: List }],
  },
  {
    title: "应用管理",
    url: "/apps",
    icon: LayoutGrid,
    children: [
      { title: "产品/App管理", url: "/apps/products", icon: Boxes },
      { title: "OAuth Client管理", url: "/apps/oauth-clients", icon: KeyRound },
    ],
  },
  {
    title: "账号管理",
    url: "/accounts",
    icon: UserCircle2,
    children: [{ title: "认证账号列表", url: "/accounts/list", icon: UserSquare2 }],
  },
  {
    title: "审计日志",
    url: "/audit",
    icon: FileText,
    children: [{ title: "日志管理", url: "/audit/logs", icon: ScrollText }],
  },
  {
    title: "系统管理",
    url: "/system",
    icon: Settings,
    children: [
      { title: "后台系统用户管理", url: "/system/users", icon: Users },
      { title: "后台系统菜单管理", url: "/system/menus", icon: MenuIcon },
      { title: "后台系统字典管理", url: "/system/dict", icon: BookMarked },
      
      { title: "协议与声明配置", url: "/system/agreements", icon: FileSignature },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) =>
    url === "/" ? currentPath === "/" : currentPath === url || currentPath.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center justify-center">
          <Cloud className="h-7 w-7 text-primary" strokeWidth={1.5} />
          {!collapsed && (
            <span className="ml-2 text-sm font-semibold tracking-wide text-foreground">
              Boo Identity
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const Icon = item.icon;
                if (!item.children) {
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <Link to={item.url}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                const groupActive = item.children.some((c) => isActive(c.url));
                return (
                  <Collapsible
                    key={item.url}
                    defaultOpen={groupActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={groupActive} tooltip={item.title}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((c) => {
                            const CIcon = c.icon;
                            return (
                              <SidebarMenuSubItem key={c.url}>
                                <SidebarMenuSubButton asChild isActive={isActive(c.url)}>
                                  <Link to={c.url}>
                                    <CIcon className="h-4 w-4" />
                                    <span>{c.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
