import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/system/departments")({
  head: () => ({ meta: [{ title: "后台系统部门管理 — Boo Identity Cloud" }] }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="后台系统部门管理" description="维护后台组织架构与部门。" />
    </AppShell>
  ),
});
