import { Secp256k1Keypair, JsonRpcProvider, RawSigner, TransactionBlock, testnetConnection, SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js'
import { create_chips, getLatestDRANDBeaconValue } from '../mintCall/utils/suiHelpers'
import * as dotenv from 'dotenv'

dotenv.config()

// provider for testnet, it holds all the read calls
const provider = new JsonRpcProvider(testnetConnection)

const packageID = process.env.PACKAGE_ID!
const adminCap = process.env.ADMIN_CAP!
const pbtArchive = process.env.PBT_ARCHIVE!

const mnemonic = Secp256k1Keypair.deriveKeypair(process.env.MNEMONIC!)
export const addressAdmin = mnemonic.getPublicKey().toSuiAddress()
export const signerAdmin = new RawSigner(mnemonic, provider)

// ------ module quantumtemple::pbt ------

/// Add chip public keys at the PhysicalArtifact.
export const pbtWhitelistChipsSui = async (chipsPublicKeys: Array<Uint8Array>, addressAdmin: string, signerAdmin: RawSigner) => {
  const tx = new TransactionBlock()

  for (let i = 0; i < chipsPublicKeys.length; i++) {
    tx.moveCall({
      target: `${packageID}::pbt::admin_add_to_archive`,
      arguments: [
        tx.object(adminCap), // admin capability
        tx.object(pbtArchive), // pbt archive
        tx.pure(Array.from(chipsPublicKeys[i])), // chip public key to add to the archive
      ],
    })
  }

  // Sign the transaction as the admin.
  tx.setSender(addressAdmin)
 
  const response = await signerAdmin.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: 'WaitForLocalExecution',
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  })

  return response
}

/// Mint a new PhysicalArtifactToken.
export const pbt_mint = async (chipSignature: Uint8Array, chipPK: Uint8Array, userAddress: string, userWallet: any) => {
  // Get the latest DRAND beacon value
  console.log("userWallet:", userWallet)
  const drandBeaconValue = await getLatestDRANDBeaconValue()

  // Get the bytes from the DRAND signature.
  const drandSignatureBytes: Uint8Array = new Uint8Array(Buffer.from(drandBeaconValue.signature, 'hex'))

  // Get the bytes for the previous DRAND signature.
  const drandPreviousSignatureBytes: Uint8Array = new Uint8Array(Buffer.from(drandBeaconValue.previous_signature, 'hex'))

  const tx = new TransactionBlock()

  tx.moveCall({
    target: `${packageID}::pbt::mint`,
    arguments: [
      tx.pure(Array.from(chipSignature)), // chip signature
      tx.pure(Array.from(chipPK)), // chip public key
      tx.pure(Array.from(drandSignatureBytes)), // DRAND signature
      tx.pure(Array.from(drandPreviousSignatureBytes)), // previous DRAND signature
      tx.pure(drandBeaconValue.round), // DRAND round
      tx.object(pbtArchive), // pbt archive
      tx.object(SUI_CLOCK_OBJECT_ID), // clock
    ],
  })

  // Sign the transaction as the user.
  tx.setSender(userAddress)

  const response = await userWallet.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: 'WaitForLocalExecution',
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  }) 

  return response
}

export const createChips = async () => {
  // Admin creates the chips and adds their public keys to the PhysicalArtifactArchive.
  // Create some chips with secp256k1 keys
  let chips: Array<{ publicKey: Uint8Array; privateKey: Uint8Array }> = []

  // In this example, we will create 1 chip so we keep track of its private key for later examples.
  chips = await create_chips(1)
  const defaultChip = chips[0]

  // Extract the public keys from the chips.
  const chipPublicKeys = chips.map((chip) => chip.publicKey)

  return { defaultChip, chipPublicKeys }
}