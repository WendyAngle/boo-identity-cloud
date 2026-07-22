import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/system/agreements")({
  head: () => ({ meta: [{ title: "协议与声明配置 — Boo Identity Cloud" }] }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="协议与声明配置" description="维护用户协议、隐私声明等文案。" />
    </AppShell>
  ),
});
