import { render } from "@testing-library/react";

import { UserSkeleton } from "./";

describe("UserSkeleton Component", () => {
  it("renders skeleton elements with loading pulse animation", () => {
    const { container } = render(<UserSkeleton />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("animate-pulse");
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("items-center");

    const avatarPlaceholder = wrapper.querySelector(".size-10.rounded-full");
    const textPlaceholder = wrapper.querySelector(".h-4.w-24");

    expect(avatarPlaceholder).toBeInTheDocument();
    expect(textPlaceholder).toBeInTheDocument();
  });

  it("applies custom className to the wrapper container", () => {
    const { container } = render(
      <UserSkeleton className="my-custom-skeleton" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("my-custom-skeleton");
    expect(wrapper).toHaveClass("animate-pulse");
  });
});
