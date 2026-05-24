# Resource Planner Widget

Modern pluggable web widget for monthly resource planning.

The widget shows resources as rows and days as columns, with multiple entry cards per resource/day cell. It includes sticky headers, virtual resource-row scrolling, loading skeletons, and actions for resources, entries, and empty cells.

This is a personal open-source project by David Salazar Rodero. 

## Status

Beta: `0.1.0`.

The widget is usable, but its public XML/API may still change before a stable `1.0.0` release.

## Configuration

- Place the widget in a data view with a DateTime attribute for `Visible month attribute`.
- Configure `Resources data source`, `Resource title`, and optional `Resource subtitle`.
- Configure `Entries data source`, `Resource association`, `Entry date`, `Entry title`, and optional subtitle/color class.
- Use `Visible resource rows` to choose how many resource rows are visible before vertical virtual scrolling starts.
- Use `On resource click`, `On entry click`, and `On empty cell click` for interactions.

`On empty cell click` provides these action variables:

- `resourceGuid`: GUID of the clicked resource.
- `date`: date represented by the clicked cell.

## Known Limitations

- No drag and drop.
- No multi-day range rendering.
- Entries should be filtered to the visible month in the data source when needed.

## Development

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

The MPK is generated as `dist/0.1.0/ResourcePlannerWidget.mpk`.
