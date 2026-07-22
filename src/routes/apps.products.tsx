import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/apps/products")({
  head: () => ({
    meta: [
      { title: "产品/App管理 — Boo Identity Cloud" },
      { name: "description", content: "维护接入认证中心的产品与应用清单。" },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="产品 / App 管理" description="登记接入认证中心的产品与应用清单。" />
    </AppShell>
  ),
});
