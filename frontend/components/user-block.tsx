import { usePrivy } from "@privy-io/react-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  User,
  Wallet,
  Copy,
  ExternalLink,
  CheckCircle2,
  LogOut,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";

export function UserBlock() {
  const { user, authenticated, logout } = usePrivy();
  const [copied, setCopied] = useState(false);

  if (!authenticated || !user) {
    return null;
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getDisplayName = () => {
    if (user.email?.address) {
      return user.email.address;
    }
    if (user.wallet?.address) {
      return `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
        -4
      )}`;
    }
    return "Anonymous User";
  };

  const getAvatarFallback = () => {
    if (user.email?.address) {
      return user.email.address.slice(0, 2).toUpperCase();
    }
    if (user.wallet?.address) {
      return user.wallet.address.slice(2, 4).toUpperCase();
    }
    return "U";
  };

  const getExplorerUrl = (address: string) => {
    // Default to Ethereum explorer, but you could detect chain
    return `https://etherscan.io/address/${address}`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* User Info Section */}
        <div className="flex items-center space-x-3">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5">
              <div className="bg-green-500 rounded-full p-0.5 border border-white">
                <CheckCircle2 className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {getDisplayName()}
              </h3>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        {user.wallet?.address && (
          <div className="flex items-center space-x-2">
            <Wallet className="h-3 w-3 text-muted-foreground" />
            <code className="text-xs font-mono bg-card/50 px-1.5 py-0.5 rounded flex-1">
              {user.wallet.address.slice(0, 6)}...
              {user.wallet.address.slice(-4)}
            </code>
            <div className="flex space-x-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(user.wallet!.address)}
                className="h-5 w-5 p-0 hover:bg-blue-100"
              >
                {copied ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <Copy className="h-2.5 w-2.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(getExplorerUrl(user.wallet!.address), "_blank")
                }
                className="h-5 w-5 p-0 hover:bg-blue-100"
              >
                <ExternalLink className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Email */}
        {user.email?.address && (
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 break-all">
              {user.email.address}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={logout}
          >
            <LogOut className="h-3 w-3 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
}
