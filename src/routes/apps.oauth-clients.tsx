import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/apps/oauth-clients")({
  head: () => ({
    meta: [
      { title: "OAuth Client管理 — Boo Identity Cloud" },
      { name: "description", content: "管理 OAuth Client 凭据、回调地址与授权范围。" },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="OAuth Client 管理" description="维护 OAuth Client 凭据、回调地址与授权范围。" />
    </AppShell>
  ),
});
