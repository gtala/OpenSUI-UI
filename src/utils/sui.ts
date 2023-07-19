import { JsonRpcProvider, testnetConnection } from '@mysten/sui.js'



export const getObjectsFromAddress = async (address: string): Promise<any> => {
  const provider = new JsonRpcProvider(testnetConnection)
    //example
  const userAddress = address

  const { getObjectsByType } = getSuiObjects(provider)
  const objects = await getObjectsByType(userAddress)

  return objects
}

export const getObjectById = async (address: string, objectId: string): Promise<any> => {
  const provider = new JsonRpcProvider(testnetConnection)
    //example
  const userAddress = address

  const { getObjectsByType } = getSuiObjects(provider)
  const objects = await getObjectsByType(userAddress)

  const filterObject = objects.filter((data) => data.objectId === objectId).map((data) => data )
  return filterObject
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
