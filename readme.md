# achiever-api

Augmented Guild Wars 2 APIs to support https://achiever.roxtar.co

## Endpoints

- `https://achiever-api.roxtar.co/raid-reports/<gw2 api token>/<dps.report token>`

The response is an array of strings, where each string is a link to a successful clear on [dps.report](https://dps.report).

## Sample Response

```
[
  "https://dps.report/AQpb-20210809-211242_vg",
  "https://dps.report/m4pk-20210809-212654_gors",
  "https://dps.report/HaRX-20210809-214531_sab",
  "https://dps.report/S8dj-20210813-200401_qpeer"
]
```

## Development

See [sam-readme](./sam-readme.md)
