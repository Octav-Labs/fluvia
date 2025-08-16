import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Fluvia = buildModule("Fluvia", (m) => {
    // Params (override via params file/CLI)
    const admin          = m.getParameter("ADMIN");
    const feeCollector   = m.getParameter("FEE_COLLECTOR");
    const feeBps         = m.getParameter("FEE_BPS", 50);           // 0.50%
    const minNet   = m.getParameter("MIN_NET", 1_000_000n);  // 1 USDC (6d)
    const fastMaxFeeBps  = m.getParameter("FAST_MAX_FEE_BPS", 100); // 1%
    const usdc           = m.getParameter("USDC");
    const tokenMessenger = m.getParameter("TOKEN_MESSENGER");

    // Deploy FeeController
    const feeController = m.contract("FeeController", [
        admin, feeCollector, feeBps, minNet, fastMaxFeeBps,
    ]);

    // Deploy Receiver implementation (no constructor; upgradeable-style)
    const receiverImpl = m.contract("Receiver", []);

    // Deploy Factory wired to chain constants + implementation
    const factory = m.contract("FluviaFactory", [
        admin, usdc, tokenMessenger, feeController, receiverImpl,
    ], {
        after: [feeController],
    });

    return { feeController, receiverImpl, factory };
});

export default Fluvia;
