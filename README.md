# Döviz PWA

Vue 3 + Vite + Pinia + TailwindCSS + `vite-plugin-pwa` ile geliştirilmiş mobil odaklı tek ekranlı bir portföy uygulaması.

## Özellikler

- Döviz/altın kurlarını API'den çeker
- Her varlık için miktar girişine izin verir
- Girilen miktarları localStorage üzerinden kalıcı saklar
- Toplam TL değerini anlık hesaplar
- Dark theme ve mobile-first tasarım sunar
- Installable PWA olarak çalışır
- Offline durumda uygulama kabuğu ve son kaydedilen kurlarla açılabilir
- Loading ve hata durumlarını gösterir

## Teknoloji Yığını

- Vue 3 Composition API
- Vite
- Pinia
- pinia-plugin-persistedstate
- TailwindCSS
- vite-plugin-pwa

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Varsayılan geliştirme adresi `http://localhost:5173` olur.

## Production Build

```bash
npm run build
npm run preview
```

## GitHub Pages Deploy

Bu proje `base: '/doviz-pwa/'` ile ayarlıdır. Repository adı `doviz-pwa` olduğu sürece GitHub Pages ile uyumludur.

Deploy için:

```bash
npm run deploy
```

Bu komut önce `dist/` build alır, sonra `gh-pages` ile yayınlar.

GitHub tarafında şu ayarı seçin:

1. Repository `Settings`
2. `Pages`
3. Source olarak `gh-pages` branch seçimi

## Proje Yapısı

```text
src/
  api/
  components/
  stores/
  views/
```

## API

Uygulama şu endpoint'ten veri çeker:

```text
GET https://yata.dovizexchange.com/users/getkurlarapp
```

Beklenen veri formatı:

```json
[
  {
    "dovizAd": "USD",
    "satisKur": 45.31
  },
  {
    "dovizAd": "EURO",
    "satisKur": 53.24
  }
]
```

API geçici olarak yanıt vermezse uygulama hata mesajı gösterir; daha önce alınmış kur verisi varsa cache üzerinden göstermeye devam eder.
