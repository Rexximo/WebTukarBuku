import type { ReactNode } from "react";
import { MemberFooter } from "@/components/member-footer";
import { MemberHeader } from "@/components/member-header";
import { requireUser } from "@/lib/session";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <>
      <MemberHeader user={user} />
      {children}
      <MemberFooter />
    </>
  );
}
