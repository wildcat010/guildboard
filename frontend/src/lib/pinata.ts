import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export async function uploadImageToIPFS(file: File): Promise<string> {
  const result = await pinata.upload.public.file(file);
  return `ipfs://${result.cid}`;
}

export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
  const result = await pinata.upload.public.json(metadata);
  return `ipfs://${result.cid}`;
}
