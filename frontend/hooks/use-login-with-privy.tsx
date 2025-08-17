import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSessionSigners } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useMe } from "./use-me";

export const useLoginWithPrivy = () => {
  const { addSessionSigners } = useSessionSigners();
  const { refetch } = useMe();
  const SESSION_SIGNER_ID = process.env.NEXT_PUBLIC_SESSION_SIGNER_ID;
  const { user } = usePrivy();
  const addSessionSigner = useCallback(
    async (walletAddress: string) => {
      if (!SESSION_SIGNER_ID) {
        console.error("SESSION_SIGNER_ID must be defined to addSessionSigner");
        return;
      }
      if (!user?.wallet?.address) {
        return;
      }
      try {
        await refetch();
        await addSessionSigners({
          address: walletAddress,
          signers: [
            {
              signerId: SESSION_SIGNER_ID,
              // This is a placeholder - in a real app, you would use a policy ID from your Privy dashboard
              policyIds: [],
            },
          ],
        });
      } catch (error) {
        console.error("Error adding session signer:", error);
      }
    },
    [addSessionSigners, user]
  );
  const handleLoginSuccess = async () => {
    await addSessionSigner(user?.wallet?.address || "");
  };
  const { login } = useLogin({
    onComplete: handleLoginSuccess,
  });
  return { login };
};
