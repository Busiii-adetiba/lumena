import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LumenClient } from "@lumen/web-sdk";
import { LumenProvider } from "./context.js";
import { LumenConnectModal } from "./components/LumenConnectModal.js";

describe("LumenConnectModal", () => {
  function renderModal(
    client: Partial<LumenClient>,
    props: Partial<React.ComponentProps<typeof LumenConnectModal>> = {},
  ) {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const utils = render(
      <LumenProvider client={client as LumenClient}>
        <LumenConnectModal open onClose={onClose} onSuccess={onSuccess} {...props} />
      </LumenProvider>,
    );
    return { ...utils, onClose, onSuccess };
  }

  it("renders nothing when closed", () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const { container } = render(
      <LumenProvider client={{} as LumenClient}>
        <LumenConnectModal open={false} onClose={onClose} onSuccess={onSuccess} />
      </LumenProvider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders an accessible dialog with both tabs", () => {
    const { container } = renderModal({});
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(
      screen.getByRole("tab", { name: "Create New Seedless Wallet" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen
        .getByRole("tab", { name: "Connect Existing Device / Passkey" })
        .getAttribute("aria-selected"),
    ).toBe("false");
  });

  it("switches tabs when clicked", () => {
    renderModal({});
    fireEvent.click(screen.getByRole("tab", { name: "Connect Existing Device / Passkey" }));
    expect(
      screen
        .getByRole("tab", { name: "Connect Existing Device / Passkey" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("button", { name: "Connect with Passkey" })).not.toBeNull();
  });

  it("creates a seedless wallet and emits onSuccess", async () => {
    const wallet = { address: "GADDRESS", id: "GADDRESS" };
    const createWallet = vi.fn().mockResolvedValue(wallet);
    const { onSuccess, onClose } = renderModal({ createWallet });

    fireEvent.click(screen.getByRole("button", { name: "Create Seedless Wallet" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ address: "GADDRESS", id: "GADDRESS" });
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("connects with a passkey and emits onSuccess", async () => {
    const wallet = { address: "GADDRESS", id: "GADDRESS", credentialId: "cred" };
    const createWalletWithPasskey = vi.fn().mockResolvedValue(wallet);
    const { onSuccess } = renderModal({ createWalletWithPasskey });

    fireEvent.click(screen.getByRole("tab", { name: "Connect Existing Device / Passkey" }));
    fireEvent.click(screen.getByRole("button", { name: "Connect with Passkey" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ address: "GADDRESS", id: "GADDRESS" });
    });
  });

  it("shows an error when wallet creation fails", async () => {
    const createWallet = vi.fn().mockRejectedValue(new Error("Creation failed"));
    renderModal({ createWallet });

    fireEvent.click(screen.getByRole("button", { name: "Create Seedless Wallet" }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toContain("Creation failed");
    });
  });

  it("calls onClose on Escape and the close button", () => {
    const { onClose } = renderModal({});

    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);

    // Overlay click (clicking the backdrop, not the dialog itself).
    const overlay = document.querySelector(".lumen-connect-modal__overlay");
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay as Element);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("applies custom theme properties", () => {
    renderModal(
      {},
      {
        theme: {
          primaryColor: "#ff0000",
          backgroundColor: "#000000",
          borderRadius: "24px",
        },
      },
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.backgroundColor).toBe("rgb(0, 0, 0)");
    expect(dialog.style.borderRadius).toBe("24px");
  });
});
