import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getPageNumbers, Pagination } from "@/components/ui/Pagination";

describe("getPageNumbers", () => {
  it("shows all pages when there are few", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it("matches the design for page 3 of 99", () => {
    expect(getPageNumbers(3, 99)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, "...", 99]);
  });
});

describe("Pagination", () => {
  it("calls onPageChange and disables Previous on the first page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
