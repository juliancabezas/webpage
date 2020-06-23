---
title: GCBM Implementation in Los Rios Region (Chile) - Pilot project (version 0.2)
author: Julián Cabezas
date: '2019-09-11'
slug: pilot_losrios_v02
categories: []
tags: []
image:
  caption: ''
  focal_point: ''
---

**Disclaimer**: This is not an offitial release and is only meant for development and feed-back purposes

### Included disturbances

In this run, we are only including the Deforestation and Substitution activities, we are using two default disturbances for their representation

- Deforestation: Deforestation-agriculture - crop-salvage and burn
- Substitution: Deforestation-agriculture - pasture -salvage and burn

### Some assumptions and procedures:

- Only native forest was included, forest plantations are considered to have "zero" carbon, this is for REDD+ accounting purposes
- The classifieres used for the mapping of the forests were "Forest type" and "Structure"
- The arborescent shrubland is considered a forest type
- The resolution used in the tiler was 0.001 degrees
- The disturbances take place in the same moment as the land use map is released (in this case the years 2006, 2013 and 2017), so we can see some spikes
- We are using linear growth curves
- The initial age was taken from a 2015 volume raster, so in order to get an age in 1997, the volume was assigned to an age in the growth curves and then the difference between 2015 and 1997 was substacted, in the case of resulting negative numbers, an initial age of 1 was assigned

### Power BI results

In the following frame we can find the results for this run of the model.

The pages of the Power BI visualization show:

- Stocks in pages 1 and 2
- Fluxes in pages 3, 4 and 5
- Disturbances in page 6
- Ages in page 7

**Power BI**
{{< rawhtml >}}
<iframe width="1100" height="750"  src="https://app.powerbi.com/view?r=eyJrIjoiNDNjYjFkZjgtMTQwNi00ZmJlLWEwNDEtNzUzZGRjZjc3OGRjIiwidCI6ImU2ZjQ4MjNiLTljZmUtNGNiYi04ZDcwLWQyNWU5YTMxZDg1OSIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
{{< /rawhtml >}}

## Next steps
- Include afforestation
- Sparse the disturbances randomly in the different "phases" e.g. distribute the deforestations detected in 2006 along the years 1997 to 2006
