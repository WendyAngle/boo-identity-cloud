import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/system/dict")({
  head: () => ({ meta: [{ title: "后台系统字典管理 — Boo Identity Cloud" }] }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="后台系统字典管理" description="维护业务字典与枚举值。" />
    </AppShell>
  ),
});
