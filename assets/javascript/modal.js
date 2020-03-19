var modalBackground = document.querySelector(".js-modal-bg");
var modal = document.querySelector(".js-modal");
var statusInput = document.querySelector("#js-modal__status")

var openModal = function() {
  modalBackground.classList += " js-modal-bg--show"
  modal.classList += " js-modal--show"

  if (typeof initModal === "function") {
    initModal()
  }

  statusInput.addEventListener("change", function(e) {
    var yearFieldWrapper = document.querySelector(".js-modal__year-wrapper")
    if (statusInput.value == "4") {
      yearFieldWrapper.classList += " js-modal__year-wrapper--show"
      yearFieldWrapper.querySelector("input").required = "true"
    } else {
      yearFieldWrapper.classList.remove("js-modal__year-wrapper--show")
      yearFieldWrapper.querySelector("input").removeAttribute("required")
    }
  })
}
