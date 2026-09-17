import { test, expect } from "@playwright/test";

test.describe("Lumen Web SDK E2E Browser Flow", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.error("BROWSER UNCAUGHT:", err));

    // Navigate to the test application served by Vite
    await page.goto("/");

    // Wait for the client to initialize and be ready
    const clientStatus = page.locator('[data-testid="client-status"]');
    await expect(clientStatus).toHaveText("Ready", { timeout: 30000 });
  });

  test("completes full browser flow: wallet creation -> balance query -> gasless payment -> policy rejection", async ({
    page,
  }) => {
    // 1. Wallet Creation
    const createWalletBtn = page.locator('[data-testid="btn-create-wallet"]');
    await expect(createWalletBtn).toBeVisible();
    await createWalletBtn.click();

    const walletStatus = page.locator('[data-testid="wallet-status"]');
    await expect(walletStatus).toHaveText("created", { timeout: 30000 });

    const walletAddress = page.locator('[data-testid="wallet-address"]');
    await expect(walletAddress).not.toHaveText("-");
    const addressText = await walletAddress.innerText();
    expect(addressText).toMatch(/^G[A-Z0-9]{55}$/);

    const walletId = page.locator('[data-testid="wallet-id"]');
    await expect(walletId).not.toHaveText("-");

    // 2. Balance Query
    const getBalanceBtn = page.locator('[data-testid="btn-get-balance"]');
    await expect(getBalanceBtn).toBeVisible();
    await getBalanceBtn.click();

    const balanceStatus = page.locator('[data-testid="balance-status"]');
    await expect(balanceStatus).toHaveText("loaded", { timeout: 20000 });

    const balanceValue = page.locator('[data-testid="balance-value"]');
    await expect(balanceValue).not.toHaveText("-");
    const balanceText = await balanceValue.innerText();
    const balanceNum = parseFloat(balanceText);
    expect(balanceNum).toBeGreaterThan(0);

    // 3. Gasless Payment Submission
    const destinationInput = page.locator('[data-testid="input-payment-destination"]');
    await expect(destinationInput).not.toHaveValue("");

    const sendPaymentBtn = page.locator('[data-testid="btn-send-payment"]');
    await expect(sendPaymentBtn).toBeVisible();
    await sendPaymentBtn.click();

    const paymentStatus = page.locator('[data-testid="payment-status"]');
    await expect(paymentStatus).toHaveText("success", { timeout: 30000 });

    const paymentHash = page.locator('[data-testid="payment-hash"]');
    await expect(paymentHash).not.toHaveText("-");
    const hashText = await paymentHash.innerText();
    expect(hashText).toMatch(/^[a-fA-F0-9]{64}$/);

    // 4. Policy Rejection
    const applyPolicyBtn = page.locator('[data-testid="btn-apply-policy"]');
    await expect(applyPolicyBtn).toBeVisible();
    await applyPolicyBtn.click();

    const policyStatus = page.locator('[data-testid="policy-status"]');
    await expect(policyStatus).toHaveText("applied", { timeout: 15000 });

    const testPolicyRejectionBtn = page.locator('[data-testid="btn-test-policy-rejection"]');
    await expect(testPolicyRejectionBtn).toBeVisible();
    await testPolicyRejectionBtn.click();

    const policyResult = page.locator('[data-testid="policy-result"]');
    await expect(policyResult).toHaveText("rejected", { timeout: 20000 });

    const policyError = page.locator('[data-testid="policy-error"]');
    await expect(policyError).toContainText("exceeds per-tx limit");
  });
});
