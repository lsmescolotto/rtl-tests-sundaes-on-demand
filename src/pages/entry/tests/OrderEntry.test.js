import { rest } from "msw";
import { server } from "../../../mocks/server";
import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import userEvent from "@testing-library/user-event";

test("handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500)),
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500)),
    ),
  );
  //example of jest.fn() apply
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("disable order button for no scoops", async () => {
  const user = userEvent.setup();
  //jest added in case it is necessary to change from jsx to tsx (use typescript)
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  const orderButton = screen.getByRole("button", { name: /order sundae!/i });
  expect(orderButton).toBeDisabled();

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: /chocolate/i,
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "1");
  expect(orderButton).toBeEnabled();

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "0");
  expect(orderButton).toBeDisabled();
});
