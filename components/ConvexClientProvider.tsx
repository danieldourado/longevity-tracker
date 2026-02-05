"use client";

import { ReactNode } from "react";
import { MockProvider } from "@/lib/mock-convex";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}
