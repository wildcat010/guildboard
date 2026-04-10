import { GUILDBOARD_ABI, GUILDBOARD_ADDRESS } from "@/contracts";
import { useWriteContract } from "wagmi";

export function useShutdownActions() {
  const { writeContract } = useWriteContract();

  const {
    writeContract: writeEnableShutdown,
    isPending: isEnableShutdownPending,
    isSuccess: isEnableShutdownSuccess,
    isError: isEnableShutdownError,
  } = useWriteContract();

  const {
    writeContract: writeDisableShutdown,
    isPending: isDisableShutdownPending,
    isSuccess: isDisableShutdownSuccess,
    isError: isDisableShutdownError,
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
    isEnableShutdownSuccess,
    isEnableShutdownError,
    disableShutdown,
    isDisableShutdownPending,
    isDisableShutdownSuccess,
    isDisableShutdownError,
  };
}
