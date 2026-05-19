import { expect, test } from "@playwright/test";

test("E2E-001 cold visitor completes audit flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /AI budget leaks/i
  );

  // Find first tool select
  await page.getByLabel("Tool").first().click();
  await page.getByRole("option", { name: "Cursor" }).click();

  await page.getByLabel("Plan").first().click();
  await page.getByRole("option", { name: /Business/ }).click();

  await page.getByLabel("Monthly spend ($)").first().fill("40");
  await page.getByLabel("Seats").first().fill("1");

  await page.getByLabel("Team size").fill("1");

  await page.getByRole("button", { name: /Run my audit/i }).click();

  await page.waitForURL(/\/audit\//, { timeout: 30_000 });
  await expect(page).toHaveURL(/\/audit\//);

  // Savings hero present
  await expect(
    page.getByText(/Potential savings|Stack optimized/i)
  ).toBeVisible();
});
