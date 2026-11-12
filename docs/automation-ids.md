# IDs de automatización

Todo elemento interactivo o de texto relevante tiene un `id` estable para pruebas E2E, con el formato:

```
<prefijo>_<dominio>_<detalle>     ej.: btn_approve_quote, fld_service_km, tbl_service_orders
```

Siempre en minúsculas, con guion bajo y sin números de posición: si hay varias instancias, se agrega el identificador del dato (`lnk_order_<id>`).

| Prefijo | Elemento | Ejemplo |
|---|---|---|
| `btn_` | Botón | `btn_submit_quote` |
| `fld_` | Campo de formulario | `fld_quote_amount` |
| `sel_` | Selector (`mat-select`, toggle group) | `sel_orders_status` |
| `frm_` | Formulario | `frm_order_complete` |
| `tbl_` | Tabla | `tbl_fleet_vehicles` |
| `lst_` | Lista | `lst_order_history` |
| `lnk_` | Enlace | `lnk_nav_fleet` |
| `chp_` | Chip de estado | `chp_routine_status_<id>` |
| `ttl_` | Título | `ttl_orders_module` |
| `txt_` | Texto informativo | `txt_vehicle_odometer` |
| `ctn_` | Contenedor o sección | `ctn_order_actions` |
