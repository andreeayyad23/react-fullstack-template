import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "../components/404Page/NotFoundPage";

export const Route = createFileRoute("/__not-found")({
  component: NotFoundPage,
});