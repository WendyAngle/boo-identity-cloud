import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/accounts/list")({
  head: () => ({
    meta: [
      { title: "认证账号列表 — Boo Identity Cloud" },
      { name: "description", content: "认证账号列表与公司绑定关系。" },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="认证账号列表" description="查看认证账号、公司绑定关系及登录状态。" />
    </AppShell>
  ),
});
