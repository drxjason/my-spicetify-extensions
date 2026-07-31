# Installation

Compatibility:

| Requirements | *ver*  |
| ------------ | ------ |
| Spotify      | 1.2.74 |
| Spicetify    | 2.42+  |

> [!WARNING]
> These extensions were built for my copy of Spotify and Spicetify. They may not work on your machine.
> The requirements table above should be an indicator to what version your clients should be in.

## Easy Install

It's simple, drag both `album-streams.js` and `player-metadata.js` to either:

- `~/.config/spicetify/Extensions` for Linux & macOS
- `%appdata%\spicetify\Extensions` for Windows

then: 

```
spicetify config extensions <extension.js>
spicetify apply
```

> [!note]
> Though this repo is for easily testing my own extensions across several hosts,
> always inspect scripts before running them
