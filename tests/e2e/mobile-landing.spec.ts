import { expect, test } from "@playwright/test";

test("mobile landing shows audit coverage panel", async ({ page }) => {
  await page.goto("/");
  const panel = page.getByTestId("hero-aside-mobile");
  await expect(panel).toBeVisible();
  await expect(panel.getByText("What is SpendSense?")).toBeVisible();
  await expect(panel.getByText(/free audit of your team/i)).toBeVisible();
  await expect(panel.getByText("Your stack, your numbers")).toBeVisible();
  await expect(panel.getByText("Plan & seat fit")).toBeVisible();
  await expect(panel.getByText("IDE overlap")).toBeVisible();
});
