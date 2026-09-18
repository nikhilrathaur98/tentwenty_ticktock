import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntryForm } from "@/components/week/EntryForm";

const options = {
  projects: [{ id: "p1", name: "Client Portal" }],
  workTypes: ["Bug fixes"],
};

const emptyValues = {
  date: "2026-01-02",
  projectId: "",
  workType: "",
  description: "",
  hours: 1,
};

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  render(
    <EntryForm
      initialValues={emptyValues}
      options={options}
      submitLabel="Add entry"
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />,
  );
  return onSubmit;
}

describe("EntryForm", () => {
  it("shows errors and does not submit when fields are empty", async () => {
    const onSubmit = renderForm();

    await userEvent.click(screen.getByRole("button", { name: "Add entry" }));

    expect(screen.getByText("Please select a project.")).toBeInTheDocument();
    expect(
      screen.getByText("Task description is required."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const onSubmit = renderForm();

    await userEvent.selectOptions(
      screen.getByLabelText(/Select Project/),
      "p1",
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/Type of Work/),
      "Bug fixes",
    );
    await userEvent.type(
      screen.getByLabelText(/Task description/),
      "Fix header",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase hours" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Add entry" }));

    expect(onSubmit).toHaveBeenCalledWith({
      date: "2026-01-02",
      projectId: "p1",
      workType: "Bug fixes",
      description: "Fix header",
      hours: 2,
    });
  });
});
