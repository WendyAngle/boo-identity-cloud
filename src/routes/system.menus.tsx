import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/system/menus")({
  head: () => ({ meta: [{ title: "后台系统菜单管理 — Boo Identity Cloud" }] }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="后台系统菜单管理" description="配置后台菜单树与角色可见性。" />
    </AppShell>
  ),
});
