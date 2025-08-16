import {getAddress, keccak256, stringToBytes} from "viem";

export function buildCreateXSalt(
    deployer: `0x${string}`,     // must be the EOA that sends the deploy tx
    ns: string,                  // e.g. "FLUVIA_FACTORY_V1"
    crossChainFlag = true        // sets 21st byte to 0x01 if true, else 0x00
): `0x${string}` {
    const addr40 = getAddress(deployer).slice(2);              // 40 hex chars = 20 bytes
    const flag2  = crossChainFlag ? "00" : "01";               // 1 byte = 2 hex chars
    const ns22   = keccak256(stringToBytes(ns)).slice(2, 2+22); // first 11 bytes = 22 hex chars
    return `0x${addr40}${flag2}${ns22}` as `0x${string}`;      // total 64 hex chars = 32 bytes
}
