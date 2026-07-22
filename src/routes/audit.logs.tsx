import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/audit/logs")({
  head: () => ({
    meta: [
      { title: "日志管理 — Boo Identity Cloud" },
      { name: "description", content: "审计与操作日志查询。" },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="日志管理" description="查询认证与后台操作的审计日志。" />
    </AppShell>
  ),
});
