// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import FamilyMemberCreate from "../features/FamilyFeatures/FamilyMemberCreate";

export const Route = createFileRoute("/family/create")({
  component: FamilyMemberCreate,
});
