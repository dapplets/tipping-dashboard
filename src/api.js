import autobahn from 'autobahn-browser'
import { div, groupAndSum, mul, sub } from './helpers'
import * as NearApiJs from 'near-api-js'

export async function getData() {
  const connection = new autobahn.Connection({
    url: 'wss://near-explorer-wamp.onrender.com/ws/',
    realm: 'near-explorer',
    retry_if_unreachable: true,
    max_retries: Number.MAX_SAFE_INTEGER,
    max_retry_delay: 10,
  })
  const promise = new Promise((resolve, reject) => (connection.onopen = resolve))
  connection.open()
  const session = await promise

  const transactions = await session.call(
    'com.nearprotocol.mainnet.explorer.transactions-list-by-account-id',
    [
      'app.tipping.near',
      10000,
      {
        endTimestamp: 1938353482933,
        transactionIndex: 0,
      },
    ],
  )

  let contractBalance = '0'

  try {
    const nearConfig = {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.mainnet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
      keyStore: new NearApiJs.keyStores.BrowserLocalStorageKeyStore(),
    }
    const near = await NearApiJs.connect(nearConfig)
    const account = await near.account('app.tipping.near')
    const balances = await account.getAccountBalance()
    contractBalance = balances.available
  } catch (e) {
    console.error(e)
  }

  const transfers = []
  const requests = []
  const uniqueUsers = []
  const usersActivity = []

  for (const tx of transactions) {
    if (!(tx.actions && tx.actions[0] && tx.actions[0].args)) {
      continue
    }

    const [action] = tx.actions
    const { args } = action

    if (uniqueUsers.findIndex((x) => x.signerId === tx.signerId) === -1) {
      uniqueUsers.push({
        signerId: tx.signerId,
        timestamp: tx.blockTimestamp,
        date: new Date(tx.blockTimestamp).toISOString().substring(0, 10),
      })
    }

    usersActivity.push({
      signerId: tx.signerId,
      timestamp: tx.blockTimestamp,
      date: new Date(tx.blockTimestamp).toISOString().substring(0, 10),
    })

    if (args.method_name === 'sendTips') {
      const total = args.deposit
      const amount = div(mul(total, '100'), '103')
      const fee = sub(total, amount)
      // Number(NearApiJs.utils.format.formatNearAmount())
      transfers.push({
        from: tx.signerId,
        to: args.args_json.recipientExternalAccount,
        amount: amount,
        fee: fee,
        total: total,
        item: args.args_json.itemId,
        timestamp: tx.blockTimestamp,
        date: new Date(tx.blockTimestamp).toISOString().substring(0, 10),
      })
    } else if (args.method_name === 'requestVerification') {
      requests.push({
        internalAccount: tx.signerId,
        externalAccount: args.args_json.externalAccount,
        url: args.args_json.externalAccount,
        isUnlink: args.args_json.isUnlink,
        timestamp: tx.blockTimestamp,
        date: new Date(tx.blockTimestamp).toISOString().substring(0, 10),
      })
    }
  }

  const senders = groupAndSum(transfers, 'from', 'amount')
  const receivers = groupAndSum(transfers, 'to', 'amount')

  return { transfers, senders, receivers, requests, uniqueUsers, usersActivity, contractBalance }
}
