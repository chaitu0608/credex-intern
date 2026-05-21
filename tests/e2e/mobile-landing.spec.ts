import { expect, test } from "@playwright/test";

test("mobile landing shows sample audit preview", async ({ page }) => {
  await page.goto("/");
  const preview = page.getByTestId("sample-preview-mobile");
  await expect(preview).toBeVisible();
  await expect(preview.getByText("$847")).toBeVisible();
  await expect(preview.getByText("$10,164/year")).toBeVisible();
});
