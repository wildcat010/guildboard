import { GUILDBOARD_ABI, GUILDBOARD_ADDRESS } from "@/contracts";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useShutdownActions() {
  const {
    writeContract: writeEnableShutdown,
    isPending: isEnableShutdownPending,
  } = useWriteContract();

  const {
    writeContract: writeDisableShutdown,
    isPending: isDisableShutdownPending,
  } = useWriteContract();

  const enableShutdown = () =>
    writeEnableShutdown({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "enableShutdown",
    });

  const disableShutdown = () =>
    writeDisableShutdown({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "disableShutdown",
    });

  return {
    enableShutdown,
    isEnableShutdownPending,
    disableShutdown,
    isDisableShutdownPending,
  };
}
