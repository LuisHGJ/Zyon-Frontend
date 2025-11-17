import { Suspense } from "react";
import SucessoClient from "./SucessoClient";

export default function Page() {
  return (
    <Suspense>
      <SucessoClient />
    </Suspense>
  );
}
