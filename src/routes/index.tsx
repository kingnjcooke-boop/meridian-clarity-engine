import { createFileRoute } from "@tanstack/react-router";
import { MeridianApp } from "@/components/meridian/MeridianApp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MeridianApp />;
}
