# achiever-api

Augmented Guild Wars 2 APIs to support https://achiever.roxtar.co

## Endpoints

- https://achiever-api.roxtar.co/raid-reports/<gw2 api token>/<dps.report token>

The response is an array of strings, where each string is a link to 

## Sample Response

```
{
  "daily": [
    {
      "id": 2903,
      "level": {
        "min": 1,
        "max": 80
      },
      "mode": "fractals",
      "icon": "https://render.guildwars2.com/file/620E0D3D2DD860700632BA7B3AC10C44CE55FD6C/1424206.png",
      "name": "Daily Tier 4 Molten Furnace",
      "description": "",
      "requirement": "Complete Molten Furnace at fractal scale 76 or higher.",
      "locked_text": "",
      "type": "Default",
      "flags": [
        "Daily"
      ],
      "tiers": [
        {
          "count": 1,
          "points": 0
        }
      ],
      "rewards": [
        {
          "type": "Item",
          "id": 78572,
          "count": 1
        }
      ]
    },
    ...
  ],
  "strike": {
    strike: {
      priority_strike: "Boneskinner",
      strike_mission: "Boneskinner",
    },
    cantha_strike: {
      priority_strike: "Harvest Temple",
      strike_mission: "Harvest Temple",
    },
  },
  "fractals": {
    "daily": [
      {
        "name": "Deepstone",
        "scales": [
          11,
          33,
          67,
          84
        ]
      },
      {
        "name": "Siren's Reef",
        "scales": [
          12,
          37,
          54,
          78
        ]
      },
      {
        "name": "Molten Furnace",
        "scales": [
          9,
          22,
          39,
          58,
          83
        ]
      }
    ],
    "recommended": [
      {
        "name": "Shattered Observatory",
        "scale": 24
      },
      {
        "name": "Solid Ocean",
        "scale": 35
      },
      {
        "name": "Sunqua Peak",
        "scale": 75
      }
    ]
  }
}
```

## Development

See [sam-readme](./sam-readme.md)
