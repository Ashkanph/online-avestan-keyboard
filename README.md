<p align="center">
  <img src="favicon.svg" alt="Avestan online keyboard logo" width="120" height="120" />
</p>

A web-based Avestan keyboard application.

Use it at https://ashkanph.github.io/online-avestan-keyboard/

- Support multiple languages (Avestan, persian and english)
- Responsive design, with a phone-style keyboard on small screens
- With light and dark themes
- Support physical keyboards
- Selectable Avestan font, with all fonts served from this project
- Can be added to a phone's home screen as an app, and works without an internet connection
- No tracking! Your data is safe.

### Characters

The characters are based on the Unicode Standard, Version 18.0:

- Avestan
  - Range: 10B00–10B3F
  - Link for more info: https://www.unicode.org/Public/18.0.0/charts/PDF/U10B00.pdf

## Development

```sh
npm install
npm run dev
```

## Fonts

The fonts in `src/assets/fonts` are licensed under the SIL Open Font License 1.1. The licence texts
are next to the fonts.

| Font                           | File                            | Licence                   | Notes                                                                                                                       |
| ------------------------------ | ------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Noto Sans Avestan (Google)     | `NotoSansAvestan-Regular.woff2` | `NotoSansAvestan-OFL.txt` | Default font                                                                                                                |
| Ahuramazda (Ernst Tremel)      | `Ahuramazda.woff2`              | `Ahuramazda-OFL.txt`      | `ahuramazda.ttf` 1.000 from [Font Library](https://fontlibrary.org/en/font/ahuramazda), compressed to WOFF2 without changes |
| GNU Unifont Upper (Unifoundry) | `UnifontUpper-Avestan.woff2`    | `Unifont-OFL.txt`         | Reduced to the Avestan block                                                                                                |
