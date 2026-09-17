import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/timesheets/StatusBadge";

describe("StatusBadge", () => {
  it("renders the status text with the right colour", () => {
    render(<StatusBadge status="missing" />);
    const badge = screen.getByText("missing");
    expect(badge).toHaveClass("bg-danger-100");
  });
});
