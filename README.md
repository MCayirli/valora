# Doviz PWA

Vue 3 + Vite + Pinia + TailwindCSS + `vite-plugin-pwa` ile gelistirilmis mobil odakli tek ekranli bir portfoy uygulamasi.

## Ozellikler

- Doviz/altin kurlarini API'den ceker
- Her varlik icin miktar girisine izin verir
- Girilen miktarlari localStorage uzerinden kalici saklar
- Toplam TL degerini anlik hesaplar
- Dark theme ve mobile-first tasarim sunar
- Installable PWA olarak calisir
- Offline durumda uygulama kabugu ve son kaydedilen kurlarla acilabilir
- Loading ve hata durumlarini gosterir

## Teknoloji Yigini

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

## Gelistirme

```bash
npm run dev
```

Varsayilan gelistirme adresi `http://localhost:5173` olur.

## Production Build

```bash
npm run build
npm run preview
```

## GitHub Pages Deploy

Bu proje `base: '/doviz-pwa/'` ile ayarlidir. Repository adi `doviz-pwa` oldugu surece GitHub Pages ile uyumludur.

Deploy icin:

```bash
npm run deploy
```

Bu komut once `dist/` build alir, sonra `gh-pages` ile yayinlar.

GitHub tarafinda su ayari secin:

1. Repository `Settings`
2. `Pages`
3. Source olarak `gh-pages` branch secimi

## Proje Yapisi

```text
src/
  api/
  components/
  stores/
  views/
```

## API

Uygulama su endpoint'ten veri ceker:

```text
GET https://yata.dovizexchange.com/users/getkurlarapp
```

Beklenen veri formati:

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

API gecici olarak yanit vermezse uygulama hata mesaji gosterir; daha once alinmis kur verisi varsa cache uzerinden gostermeye devam eder.
