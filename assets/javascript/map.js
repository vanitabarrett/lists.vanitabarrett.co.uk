var openMapFullSize = function() {
  var map = document.querySelector(".dashboard__map-wrapper")
  map.classList += " dashboard__map-wrapper--full-size"
}

var closeFullSizeMap = function() {
  var map = document.querySelector(".dashboard__map-wrapper")
  map.classList.remove("dashboard__map-wrapper--full-size")
}
