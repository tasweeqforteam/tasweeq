# 11 · AI-Assisted Production Workflow

```
Brief → Research → Reference evaluation → Creative strategy → Art direction → Layout plan (wireframe)
→ Asset generation/selection → Typography & graphics → Compositing & refinement → QA → Delivery
```

## 1. Capability map. Probe before you promise

Claude itself cannot generate raster images. What can produce or edit images
depends on the connected tools. Check with `ToolSearch` at the start of the job.

| Need | Possible route (if present and authenticated) | Status at build time |
|---|---|---|
| Text-to-image | Figma MCP `generate_image`, `weave_*` model runs | listed in the tool roster, **not exercised** |
| Generative fill / expand | Adobe MCP `image_fill_area`, `image_generative_expand` | listed, **not exercised** |
| Cut-out | Adobe `image_remove_background`, `image_select_subject` | listed, not exercised |
| Grade / light | Adobe `image_adjust_*`, `image_apply_lens_blur`, `image_add_grain` | listed, not exercised |
| Crop / resize | Adobe `image_crop_and_resize`; or CSS `object-fit`/`object-position` in the layout | CSS route verified |
| Vectorise | Adobe `image_vectorize` | listed, not exercised |
| Stock | Adobe `asset_search` / `asset_license_and_download_stock` (licensing!) | listed, not exercised |
| Vector shapes, illustration, devices | inline SVG in the HTML layout | **verified** |
| Live typography over images | HTML/CSS rendered by Chromium | **verified** |

These tools upload content to third-party services. Get the user's
go-ahead before sending client assets. Mention any Adobe init steps the tool
demands (e.g. `adobe_mandatory_init`). When no generator is available, say so,
then deliver the layout with clearly marked image placeholders, an image brief
per slot (§2), and an SVG/graphic or typographic solution where it is truly
stronger. Never pass a placeholder off as a final photo.

## 2. Image brief (write it per slot before generating)

```
Slot / zone ...... e.g. cols 3–6, rows 2–7 of 1080×1350; subject must clear the headline zone (cols 1–6, row 1)
Subject .......... exact product (attach reference photo), state, count
Composition ...... subject position in frame, scale, horizon, leading lines
Camera ........... angle (eye-level / 30° high / top-down), focal length feel (35 mm environmental / 85–100 mm product)
Perspective ...... match vanishing points across a campaign set
Lighting ......... key direction (must match the type side: avoid hot highlights under text), softness, rim, colour temp
Materials ........ glass / paper / skin / metal behaviour; avoid plastic CG sheen
Colour ........... palette from the system; background tone value (for text contrast)
Focal point ...... one
Negative space ... where and how much (e.g. top 30% clean, low-texture gradient)
Crop intent ...... the final crop + bleed margin to allow recomposition for other ratios (generate wider than needed)
Typography ....... where text will sit; keep that region low-detail
Brand constraints  logo never generated; label text never generated; product geometry from reference only
Exclusions ....... text, watermarks, extra fingers, warped labels, duplicate products
```

## 3. Compositing & refinement checklist

Crop → perspective match → light direction match → contact shadows plus cast
shadows consistent in direction and softness → edge quality (no halos, hair
detail) → colour match (black point, white point, grade) → grain unification →
product detail check against the reference → place live typography and logo
last. Only report edits that were actually executed and can be seen in the output.

## 4. Product and brand fidelity across a campaign

For every generated variation: compare silhouette, proportions, label layout,
colour, cap and material with the reference photo. Reject the generation if
any differ, or composite the real product photo instead. Logos are always the
supplied vector or PNG, never regenerated. Label text is always real
(composited or typeset), never generated.

## 5. Text never comes from the image model

Headlines, Arabic copy, brand names, labels, prices, dates, CTAs and legal text
are typeset in HTML (module 06 §4). If a generated image contains stray
letters, retouch them out or regenerate.

## 6. Output honesty

| You can deliver | You cannot claim (unless an actual tool produced it) |
|---|---|
| PNG at 1×/2×, PDF with live text, HTML source (editable layout, live text) | layered PSD, editable AI/vector file, InDesign package, CMYK print PDF |
| Adobe Express document via `export_html_to_express` (after readiness check + consent) | "retouched in Photoshop" |
| .pptx via the pptx skill | Figma file, unless `use_figma` actually created it |
