import { useCallback, useState } from "react";
import {
  getAccessToken,
  useSessionSigners,
  useSignMessage,
  useSignMessage as useSignMessageSolana,
  WalletWithMetadata,
} from "@privy-io/react-auth";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SESSION_SIGNER_ID = process.env.NEXT_PUBLIC_SESSION_SIGNER_ID;

interface WalletCardProps {
  wallet: WalletWithMetadata;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const { addSessionSigners, removeSessionSigners } = useSessionSigners();
  const { signMessage: signMessageEthereum } = useSignMessage();
  const { signMessage: signMessageSolana } = useSignMessageSolana();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoteSigning, setIsRemoteSigning] = useState(false);
  const [isClientSigning, setIsClientSigning] = useState(false);

  // Check if this specific wallet has session signers
  const hasSessionSigners = wallet.delegated === true;

  const addSessionSigner = useCallback(
    async (walletAddress: string) => {
      if (!SESSION_SIGNER_ID) {
        console.error("SESSION_SIGNER_ID must be defined to addSessionSigner");
        return;
      }

      setIsLoading(true);
      try {
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
      } finally {
        setIsLoading(false);
      }
    },
    [addSessionSigners]
  );

  const removeSessionSigner = useCallback(
    async (walletAddress: string) => {
      setIsLoading(true);
      try {
        await removeSessionSigners({ address: walletAddress });
      } catch (error) {
        console.error("Error removing session signer:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [removeSessionSigners]
  );

  const handleClientSign = useCallback(async () => {
    setIsClientSigning(true);
    try {
      const message = `Signing this message to verify ownership of ${wallet.address}`;
      let signature;
      if (wallet.chainType === "ethereum") {
        const result = await signMessageEthereum({ message });
        signature = result.signature;
      } else if (wallet.chainType === "solana") {
        const result = await signMessageSolana({
          message,
        });
        signature = result.signature;
      }
      console.log("Message signed on client! Signature: ", signature);
    } catch (error) {
      console.error("Error signing message:", error);
    } finally {
      setIsClientSigning(false);
    }
  }, [wallet]);

  const handleRemoteSign = useCallback(async () => {
    setIsRemoteSigning(true);
    try {
      const authToken = await getAccessToken();
      const path =
        wallet.chainType === "ethereum"
          ? "/api/ethereum/personal_sign"
          : "/api/solana/sign_message";
      const message = `Signing this message to verify ownership of ${wallet.address}`;
      const response = await axios.post(
        path,
        {
          wallet_id: wallet.id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        console.log(
          "Message signed on server! Signature: " + data.data.signature
        );
      } else {
        throw new Error(data.error || "Failed to sign message");
      }
    } catch (error) {
      console.error("Error signing message:", error);
    } finally {
      setIsRemoteSigning(false);
    }
  }, [wallet.id]);

  return (
    <Card className="border-fluvia-blue/20 hover:border-fluvia-blue/40 transition-colors">
      <CardHeader>
        <CardTitle className="text-sm text-primary">
          {wallet.walletClientType === "privy" ? "Embedded " : ""}Wallet:{" "}
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </CardTitle>
        <CardDescription>Chain: {wallet.chainType}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => addSessionSigner(wallet.address)}
            disabled={isLoading || hasSessionSigners}
            variant="default"
            size="sm"
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Add Session Signer"}
          </Button>

          <Button
            onClick={() => removeSessionSigner(wallet.address)}
            disabled={isLoading || !hasSessionSigners}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Remove Session Signer"}
          </Button>
        </div>

        {hasSessionSigners && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
            This wallet has active session signers
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleRemoteSign}
            disabled={isRemoteSigning || !hasSessionSigners}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            {isRemoteSigning ? "Signing..." : "Sign message from server"}
          </Button>

          <Button
            onClick={handleClientSign}
            disabled={isClientSigning}
            className="flex-1 bg-fluvia-green hover:bg-fluvia-green/90 text-white"
            size="sm"
          >
            {isClientSigning ? "Signing..." : "Sign message from client"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
