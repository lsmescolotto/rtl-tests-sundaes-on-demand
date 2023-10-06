import { render, screen } from "../../../test-utils/testing-library-utils";
import ScoopOptions from "../ScoopOptions";
import userEvent from "@testing-library/user-event";

test("box turns red when there's an error", async () => {
  const user = userEvent.setup();
  render(<ScoopOptions name="Chocolate" imagePath={""} />);
  //negative number
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: /chocolate$/i,
  });
  user.clear(chocolateInput);
  user.type(chocolateInput, "-1");
  expect(chocolateInput).toHaveClass("is-invalid");

  //positive number under 10
  user.clear(chocolateInput);
  user.type(chocolateInput, "1");
  expect(chocolateInput).not.toHaveClass("is-invalid");

  //more than 10 units
  user.clear(chocolateInput);
  user.type(chocolateInput, "15");
  expect(chocolateInput).toHaveClass("is-invalid");

  //positive number under 10
  user.clear(chocolateInput);
  user.type(chocolateInput, "1");
  expect(chocolateInput).not.toHaveClass("is-invalid");

  //decimal number
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: /vanilla$/i,
  });
  user.clear(vanillaInput);
  user.type(vanillaInput, "2.5");
  expect(vanillaInput).toHaveClass("is-invalid");

  //positive number under 10
  user.clear(vanillaInput);
  user.type(vanillaInput, "3");
  expect(vanillaInput).not.toHaveClass("is-invalid");
});
