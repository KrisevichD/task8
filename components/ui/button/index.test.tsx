import { render, screen } from "@testing-library/react";

import { Button } from "./index";

describe("Button Component", () => {
  it("должен корректно рендерить текст кнопки", () => {
    render(<Button>Кликни меня</Button>);

    const buttonElement = screen.getByText("Кликни меня");
    expect(buttonElement).toBeInTheDocument();
  });
});
