import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface AddFluviaDialogProps {
  onFluviaAdded: () => void;
}

interface FormData {
  label: string;
  chains: string[];
  depositAddress: string;
}

const availableChains = [
  { id: "ethereum", label: "Ethereum" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "base", label: "Base" },
];

export function AddFluviaDialog({ onFluviaAdded }: AddFluviaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { user } = usePrivy();
  const [formData, setFormData] = useState<FormData>({
    label: "",
    chains: ["ethereum", "arbitrum", "base"],
    depositAddress: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }

    if (!formData.depositAddress.trim()) {
      newErrors.depositAddress = "Deposit address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.depositAddress)) {
      newErrors.depositAddress = "Invalid Ethereum address format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the new API endpoint with the correct format
      const response = await fetch("/api/fluvias/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          label: formData.label,
          recipientAddress: formData.depositAddress,
          walletId: user?.wallet?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData, "errorData");
      }

      const result = await response.json();
      console.log("Fluvia created:", result);

      // Reset form and close dialog
      setFormData({
        label: "",
        chains: ["ethereum", "arbitrum", "base"],
        depositAddress: "",
      });
      setErrors({});
      setOpen(false);

      // Notify parent component
      onFluviaAdded();
    } catch (error) {
      console.error("Error creating fluvia:", error);
      // You could add a toast notification here
      alert(error instanceof Error ? error.message : "Failed to create fluvia");
    } finally {
      setLoading(false);
    }
  };

  const handleChainToggle = (chainId: string) => {
    setFormData((prev) => ({
      ...prev,
      chains: prev.chains.includes(chainId)
        ? prev.chains.filter((id) => id !== chainId)
        : [...prev.chains, chainId],
    }));
  };

  const resetForm = () => {
    setFormData({
      label: "",
      chains: ["ethereum", "arbitrum", "base"],
      depositAddress: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Plus className="h-4 w-4" />
          <span>Add Fluvia</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Fluvia</DialogTitle>
          <DialogDescription>
            Add a new Fluvia instance to manage your cross-chain operations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              placeholder="e.g., Treasury Fluvia"
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              className={errors.label ? "border-red-500" : ""}
            />
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Supported Chains</Label>
            <div className="grid grid-cols-3 gap-3">
              {availableChains.map((chain) => (
                <div key={chain.id} className="flex items-center space-x-2">
                  <Checkbox
                    disabled={true}
                    id={chain.id}
                    checked={formData.chains.includes(chain.id)}
                    onCheckedChange={() => handleChainToggle(chain.id)}
                  />
                  <Label
                    htmlFor={chain.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {chain.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.chains && (
              <p className="text-sm text-red-500">{errors.chains}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="depositAddress">Receiving Address</Label>
            <Input
              id="depositAddress"
              placeholder="0x..."
              value={formData.depositAddress}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  depositAddress: e.target.value,
                }))
              }
              className={errors.depositAddress ? "border-red-500" : ""}
            />
            {errors.depositAddress && (
              <p className="text-sm text-red-500">{errors.depositAddress}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Fluvia"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
