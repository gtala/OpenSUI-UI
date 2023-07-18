import { JsonRpcProvider, testnetConnection } from '@mysten/sui.js'

export const sui = async (): Promise<void> => {
  const provider = new JsonRpcProvider(testnetConnection)
    //example
  const userAddress = '0x41b01cacf53666f2dac8a3aebf7472ad5b9171a9c02ba728deb864d43f18bd9d'

  const { getObjectsByType } = getSuiObjects(provider)
  const objects = await getObjectsByType(userAddress)

  for (const ownedObject of objects) {
    console.log('ownedObject', ownedObject)
  }

}

export function getSuiObjects(provider: JsonRpcProvider) {
  const getObjectsByType = async (address: string | undefined, nextCursor = ''): Promise<any[]> => {
    if (!address) return []

    const queryFilter = {
     // filter: { StructType: type },
      owner: address,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
        showDisplay : true
      },
    }

    if (nextCursor) {
      Object.assign(queryFilter, { cursor: nextCursor })
    }

    const ownedObjects = await provider.getOwnedObjects(queryFilter)

    const objectsArray = ownedObjects.data.map((item) => item.data)

    let nextPageData: any[] = []
    if (ownedObjects.hasNextPage && typeof ownedObjects?.nextCursor === 'string') {
      nextPageData = await getObjectsByType(address, ownedObjects.nextCursor)
    }

    return objectsArray.concat(nextPageData)
  }

  return {
    getObjectsByType,
  }
}