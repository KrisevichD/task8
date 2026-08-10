import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useDebounce } from "./useDebounce";

describe("useDebounce Hook Module", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Execution and Timing Mechanics", () => {
    it("should instantly return the initial raw value on first render", () => {
      const { result } = renderHook(() => useDebounce("initial-text", 500));

      expect(result.current).toBe("initial-text");
    });

    it("should postpone value transformation updates until the configured delay window expires", () => {
      const { result, rerender } = renderHook(
        ({ val, time }) => useDebounce(val, time),
        { initialProps: { val: "first", time: 300 } },
      );

      rerender({ val: "changed", time: 300 });

      act(() => {
        vi.advanceTimersByTime(299);
      });

      expect(result.current).toBe("first");

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current).toBe("changed");
    });

    it("should fall back gracefully to a 300ms delay window if no parameter configuration is provided", () => {
      const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
        initialProps: { val: "alpha" },
      });

      rerender({ val: "beta" });

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe("alpha");

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe("beta");
    });

    it("should clear and override trailing scheduled macros tasks if variables mutate rapidly", () => {
      const { result, rerender } = renderHook(
        ({ val }) => useDebounce(val, 300),
        { initialProps: { val: "start" } },
      );

      rerender({ val: "mutation-one" });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      rerender({ val: "mutation-two" });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current).toBe("start");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current).toBe("mutation-two");
    });
  });
});
