import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";
const { render, screen } = require("@testing-library/react");

test("disable button by checking a checkbox", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  const button = screen.getByRole("button");
  const checkbox = screen.getByRole("checkbox");

  expect(checkbox).not.toBeChecked();
  expect(button).toBeDisabled();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(button).toBeEnabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();

  render(<SummaryForm />);
  //popover is not showing
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i,
  );
  expect(nullPopover).not.toBeInTheDocument();

  //popover appears on mouse hover
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);

  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  //popover disappears on mouse unhover
  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();
});
