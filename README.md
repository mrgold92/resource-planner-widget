# Resource Planner Widget

Modern pluggable web widget for monthly resource planning.

The widget shows resources as rows and days as columns, with multiple entry cards per resource/day cell. It is inspired by the retired `platformlabs/platform-planner-widget`, but this implementation is built fresh with the current pluggable widget tooling.

## Configuration

- Place the widget in a data view with a DateTime attribute for `Visible month attribute`.
- Configure `Resources data source`, `Resource title`, and optional `Resource subtitle`.
- Configure `Entries data source`, `Resource association`, `Entry date`, `Entry title`, and optional subtitle/color class.
- Use `On resource click`, `On entry click`, and `On empty cell click` for interactions.

`On empty cell click` provides these action variables:

- `resourceGuid`: GUID of the clicked resource.
- `date`: date represented by the clicked cell.

## Development

```powershell
npm.cmd run lint
npm.cmd run build
```

The MPK is generated in `dist/1.0.0/.Resourceplannerwidget.mpk`.
