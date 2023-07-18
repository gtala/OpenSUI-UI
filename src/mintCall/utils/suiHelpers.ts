import { Secp256k1Keypair } from '@mysten/sui.js'
import axios from 'axios'

/// Convert a base64 string to a Uint8Array.
export function base64ToUint8Array(base64: string): Uint8Array {
  const binary_string = atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes
}

/// Create X dummy chips with secp256k1 key pairs.
/// Returns an array of objects with the public and private keys.
const create_chips = async (amount: number): Promise<Array<{ publicKey: Uint8Array; privateKey: Uint8Array }>> => {
  // Define the chip interface
  const defaultChips: Array<{ publicKey: Uint8Array; privateKey: Uint8Array }> = []
  for (let i = 0; i < amount; i++) {
    const keypair = Secp256k1Keypair.generate()
    // the private key is in base64 format
    const privateKeyBase64 = keypair.export().privateKey
    const privateKeyBytes = base64ToUint8Array(privateKeyBase64)

    defaultChips.push({
      publicKey: keypair.getPublicKey().toBytes(),
      privateKey: new Uint8Array(privateKeyBytes),
    })
  }

  return defaultChips
}

/// Get the latest DRAND beacon value from the DRAND API.
/// Returns an object with the current round, randomness, signature, and previous signature.
const getLatestDRANDBeaconValue = async () => {
  const response = await axios.get('https://api.drand.sh/public/latest')
  return response.data
}

/// A chip's signature is created by signing a message-to-sign that contains:
/// - the user's address
/// - the latest DRAND beacon value
const generateSignature = async (address: string, chip: any, extra_byte: boolean) => {
  const msgToSign: Array<Uint8Array> = []

  // Remove the "0x" prefix and convert to Uint8Array
  // Sui CLI: sui keytool hex-to-bytes <userAddress>
  const addressBytes: Uint8Array = new Uint8Array(Buffer.from(address.slice(2), 'hex'))
  msgToSign.push(addressBytes)

  // Get the latest DRAND beacon value
  const drandData = await getLatestDRANDBeaconValue()

  // Get the bytes from the DRAND signature.
  const drandSignatureBytes: Uint8Array = new Uint8Array(Buffer.from(drandData.signature, 'hex'))

  // Add DRAND signature to the message to sign.
  msgToSign.push(drandSignatureBytes)

  // The chip signature is the signature of the message-to-sign with the chip's private key.
  const chipPrivateKey = chip.privateKey
  const chipKeypair = Secp256k1Keypair.fromSecretKey(chipPrivateKey)

  // Concatenate the message-to-sign Uint8Arrays to one byte array.
  let msgToSignBytes: Uint8Array = new Uint8Array()

  msgToSign.forEach((msg) => {
    msgToSignBytes = Uint8Array.from([...msgToSignBytes, ...msg])
  })

  // Add an extra byte to the message-to-sign if we want to create a wrong signature.
  if (extra_byte) {
    msgToSignBytes = new Uint8Array([...msgToSignBytes, 0])
  }

  // Sign the message-to-sign with the chip's private key.
  const chipSignature = chipKeypair.signData(msgToSignBytes)

  return chipSignature
}

/// Filters all PBT objects and returns the one with the matching chip_pk.
function findPBTByChipPK(objects: any, targetChipPK: Uint8Array) {
  // Convert the targetChipPK to an array.
  const targetChipPKArr = Array.from(targetChipPK)

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    if (object.content.fields.chip_pk.length !== targetChipPKArr.length) {
      continue // Skip if lengths are not equal.
    }

    let isMatch = true
    for (let j = 0; j < targetChipPKArr.length; j++) {
      if (object.content.fields.chip_pk[j] !== targetChipPKArr[j]) {
        isMatch = false
        break
      }
    }

    if (isMatch) {
      return object
    }
  }

  // If no object is found, return null.
  return null
}

export { create_chips, getLatestDRANDBeaconValue, generateSignature, findPBTByChipPK }
