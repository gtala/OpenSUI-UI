import { sui } from './sui'

const tasksMap = {
  sui: sui,
}

async function main(args: string[]): Promise<void> {
  try {
    console.info(`process ${args[0]} has started...`)
    console.table(await tasksMap[args[0]](args.slice(1)))
  } catch (e) {
    console.error(e)
    console.info(`process ${args[0]} has terminated with errors`)
    return
  }
  console.info(`process ${args[0]} has finished successfully...`)
}

main(process.argv.slice(2))
