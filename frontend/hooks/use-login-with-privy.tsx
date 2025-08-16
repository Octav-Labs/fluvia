import { useLogin } from "@privy-io/react-auth";
import { useSessionSigners } from "@privy-io/react-auth";

export const useLoginWithPrivy = () => {
  const { addSessionSigners } = useSessionSigners();
  const handleLoginSuccess = async () => {
    await addSessionSigners({
      address: "insert-user-embedded-wallet-address",
      signers: [
        {
          signerId: "ovscx4a3irn9333mopyuvxbe",
          // Replace the `policyIds` array with an array of valid policy IDs if you'd like the session signer to only be able to execute certain transaction requests allowed by a policy. If you'd like the session signer to have full permission, pass an empty array ([]).
          policyIds: [],
        },
      ],
    });
  };
  const { login } = useLogin({
    onComplete: handleLoginSuccess,
  });
  return { login };
};
