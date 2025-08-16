// Type overrides for problematic dependencies
declare module "ox" {
  // Override the problematic signature type
  export interface Signature {
    r?: bigint | undefined;
    s?: bigint | undefined;
    yParity?: number | undefined;
  }

  // Override the from function to accept the problematic signature
  export function from(signature: any): any;

  // Add any other problematic types here
  export namespace Signature {
    function fromTuple(tuple: [number, bigint, bigint]): any;
  }
}

// Override viem types that might be causing issues
declare module "viem" {
  export interface Signature {
    r?: bigint | undefined;
    s?: bigint | undefined;
    yParity?: number | undefined;
  }
}

// Global type declarations
declare global {
  // Add any global types here if needed
}

export {};
