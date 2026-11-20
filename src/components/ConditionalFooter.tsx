"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

function FooterContent() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return <Footer />;
}

export default function ConditionalFooter() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
}