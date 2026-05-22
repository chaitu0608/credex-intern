import { expect, test } from "@playwright/test";

test("E2E-001 cold visitor completes audit flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /AI budget leaks/i
  );

  // Add Cursor from tool palette
  await page.getByRole("button", { name: /Cursor/i }).first().click();

  await page.getByLabel("Plan").first().click();
  await page.getByRole("option", { name: /Business/ }).click();

  await page.getByLabel("Monthly spend ($)").first().fill("40");
  await page.getByLabel("Seats").first().fill("1");

  await page.getByLabel("Team size").fill("1");

  await page.locator("#audit-form").scrollIntoViewIfNeeded();

  const auditPost = page.waitForResponse(
    (res) =>
      res.url().includes("/api/audit") && res.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Run my audit/i }).click();
  const auditRes = await auditPost;
  expect(auditRes.ok(), `audit API failed: ${auditRes.status()}`).toBeTruthy();

  await page.waitForURL(/\/audit\//, { timeout: 15_000 });
  await expect(page).toHaveURL(/\/audit\//);

  // Report hero (distinct from stack-health table label "Potential savings")
  await expect(
    page.getByText(/Potential monthly savings|Stack optimized/i).first()
  ).toBeVisible();
});
