import { GUILDBOARD_ABI, GUILDBOARD_ADDRESS } from "@/contracts";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useShutdownActions() {
  const { writeContract } = useWriteContract();

  const {
    writeContract: writeEnableShutdown,
    isPending: isEnableShutdownPending,
    data: enableShutdownHash,
  } = useWriteContract();

  const {
    isLoading: isEnableShutdownConfirming,
    isSuccess: isEnableShutdownConfirmed,
  } = useWaitForTransactionReceipt({
    hash: enableShutdownHash,
  });

  const {
    writeContract: writeDisableShutdown,
    isPending: isDisableShutdownPending,
    data: disableShutdownHash,
  } = useWriteContract();

  const {
    isLoading: isDisableShutdownConfirming,
    isSuccess: isDisableShutdownConfirmed,
  } = useWaitForTransactionReceipt({
    hash: disableShutdownHash,
  });

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
    isEnableShutdownConfirming,
    isEnableShutdownConfirmed,
    disableShutdown,
    isDisableShutdownPending,
    isDisableShutdownConfirming,
    isDisableShutdownConfirmed,
  };
}
