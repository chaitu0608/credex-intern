import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function completeMinimalAudit(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /Cursor/i }).first().click();
  await page.getByLabel("Plan").first().click();
  await page.getByRole("option", { name: /Business/ }).click();
  await page.getByLabel("Monthly spend ($)").first().fill("40");
  await page.getByLabel("Seats").first().fill("1");
  await page.getByLabel("Team size").fill("1");
  await page.getByRole("button", { name: /Run my audit/i }).click();
  await page.waitForURL(/\/audit\//, { timeout: 30_000 });
}

test("E2E-005 landing has no critical a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("E2E-005b audit results page has no critical a11y violations", async ({
  page,
}) => {
  await page.goto("/");
  await completeMinimalAudit(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});
