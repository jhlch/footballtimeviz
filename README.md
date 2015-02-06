

FootballTime Viz
================

Steps to finish this off:

* Add your data objects to data.js
* There are some boolean flags and other constants in d3-chart.js controlling various 
  features that you may want to tweak. They're at the top of the function.
* If you want to modify the chart size, edit `CHART_WIDTH` and `CHART_HEIGHT` in
  d3-chart.js. Also modify the `.chartbox width` property at the top of footballtime.css
* Modify the tipsy tooltip at the bottom of d3-chart.js to include the various properties
  you actually care about (instead of `.foo`, `.bar`, etc.)
* The aforementioned are marked with `TODO` comments in the code.

* View the index.html locally in Google Chrome. Don't forget to check that this all works
  offline for max presentation awesome. I think I've brought all the necessary .js and .css
  files into this repo, but you can't be too careful.
