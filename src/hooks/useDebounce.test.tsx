import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("delays value updates until the timeout completes", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "bags" } },
    );

    expect(result.current).toBe("bags");

    rerender({ value: "beauty" });
    expect(result.current).toBe("bags");

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe("bags");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("beauty");

    vi.useRealTimers();
  });
});
