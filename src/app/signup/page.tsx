// src/app/signup/page.tsx
import { Suspense } from "react";
import ClientPage from "./_components/client-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
