import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/system/users")({
  head: () => ({ meta: [{ title: "后台系统用户管理 — Boo Identity Cloud" }] }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="后台系统用户管理" description="管理后台运营人员账号与权限。" />
    </AppShell>
  ),
});
