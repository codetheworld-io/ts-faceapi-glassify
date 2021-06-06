# ts-faceapi-glassify

Source code for [How To Create “Glassify” Faces API With face-api.js?](https://hoangdv.medium.com/how-to-create-glassify-faces-api-with-face-api-js-f2a11367db4f)

## How to start?

1. Install dependencies

```
npm ci
```

2. Start dev server

```
npm run dev
```

4. Play

```
curl --location --request POST 'localhost:3000/glassify' \
--form 'image=@"/Users/username/Downloads/faces.jpg"'
```
