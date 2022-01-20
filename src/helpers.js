import BigNumber from 'bignumber.js'

export function sum(...values) {
  let _sum = new BigNumber('0')
  for (const v of values) {
    const _a = new BigNumber(_sum)
    const _b = new BigNumber(v)
    _sum = _a.plus(_b)
  }
  return _sum.toFixed()
}

export function sub(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  const _c = _a.minus(_b)
  return _c.toFixed()
}

export function mul(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  const _c = _a.multipliedBy(_b)
  return _c.toFixed()
}

export function div(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  const _c = _a.dividedToIntegerBy(_b)
  return _c.toFixed()
}

export function lte(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.lte(_b)
}

export function gte(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.gte(_b)
}

export function equals(a, b) {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.isEqualTo(_b)
}

export function toFixedString(a, fractionDigits) {
  return Number(a).toFixed(fractionDigits)
}

export function groupAndSum(array, keyProp, valueProp) {
  const result = {}
  for (const x of array) {
    if (result[x[keyProp]] === undefined) {
      if (valueProp) {
        result[x[keyProp]] = { sum: '0', count: 0 }
      } else {
        result[x[keyProp]] = { count: 0 }
      }
    }

    if (valueProp) {
      result[x[keyProp]] = {
        sum: sum(result[x[keyProp]].sum, x[valueProp]),
        count: result[x[keyProp]].count + 1,
      }
    } else {
      result[x[keyProp]] = {
        count: result[x[keyProp]].count + 1,
      }
    }
  }
  return result
}

export function groupAndSumScalar(array, keyProp, valueProp) {
  const result = {}
  for (const x of array) {
    if (result[x[keyProp]] === undefined) {
      if (valueProp) {
        result[x[keyProp]] = { sum: 0, count: 0 }
      } else {
        result[x[keyProp]] = { count: 0 }
      }
    }

    if (valueProp) {
      result[x[keyProp]] = {
        sum: result[x[keyProp]].sum + x[valueProp],
        count: result[x[keyProp]].count + 1,
      }
    } else {
      result[x[keyProp]] = {
        count: result[x[keyProp]].count + 1,
      }
    }
  }
  return result
}

export function getDates(startDate, endDate) {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }
  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = addDays.call(currentDate, 1)
  }
  return dates
}

export function findCumulativeSum(arr) {
  const creds = arr.reduce(
    (acc, val) => {
      let { sum, res } = acc
      sum += val
      res.push(sum)
      return { sum, res }
    },
    {
      sum: 0,
      res: [],
    },
  )
  return creds.res
}
