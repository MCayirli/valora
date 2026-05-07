const RATES_ENDPOINT = 'https://yata.dovizexchange.com/users/getkurlarapp'
const REQUEST_TIMEOUT_MS = 15000

function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeout)

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    window.clearTimeout(timeoutId)
  })
}

export async function getExchangeRates() {
  const response = await fetchWithTimeout(RATES_ENDPOINT, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Kur verisi alınamadı (${response.status}).`)
  }

  const payload = await response.json()

  if (!Array.isArray(payload)) {
    const apiMessage =
      typeof payload?.error === 'string' && payload.error.trim().length > 0
        ? payload.error.trim()
        : 'Beklenmeyen API yanıtı alındı.'

    throw new Error(apiMessage)
  }

  const rates = payload
    .map((item) => ({
      code: String(item?.dovizAd ?? '').trim(),
      shortCode: String(item?.dovizcins ?? item?.dovizAd ?? '').trim(),
      buyRate: Number(item?.alisKur ?? 0),
      sellRate: Number(item?.satisKur ?? 0),
      category: String(item?.dovizMaden ?? '').trim(),
    }))
    .filter(
      (item) =>
        item.code &&
        item.shortCode &&
        Number.isFinite(item.buyRate) &&
        Number.isFinite(item.sellRate) &&
        (item.buyRate > 0 || item.sellRate > 0),
    )

  if (!rates.length) {
    throw new Error('Geçerli kur verisi bulunamadı.')
  }

  return rates
}
