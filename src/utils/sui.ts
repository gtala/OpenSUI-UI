import { JsonRpcProvider, testnetConnection } from '@mysten/sui.js'

export const getObjectFromAddress = async (address: string): Promise<void> => {
  const provider = new JsonRpcProvider(testnetConnection)
    //example
  const userAddress = address

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