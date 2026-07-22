import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/companies/list")({
  head: () => ({
    meta: [
      { title: "公司列表 — Boo Identity Cloud" },
      { name: "description", content: "查看和管理已接入认证中心的公司主体。" },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="公司列表" description="维护公司主体、认证状态和成员绑定关系。" />
    </AppShell>
  ),
});
