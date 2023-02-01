function prepopulateFields(id) {
  var element = document.getElementById(id)
  var fieldsToPopulate = document.querySelectorAll("[data-prepopulate]")

  fieldsToPopulate.forEach(function(field) {
    var key = field.getAttribute("data-prepopulate")
    var value = ""

    if (key !== "type" && key !== "id")  {
      value = element.querySelector("[data-" + key + "]").getAttribute("data-" + key)
    } else if (key === "type") {
      value = document.querySelector("[data-type]").getAttribute("data-type")
    } else if (key === "id") {
      value = id
    }

    if (key === 'rating' && value > 0) {
      var ratingInputs = field.querySelectorAll('input')
      ratingInputs.forEach(function (input) {
        if (value <= input.value) {
          input.checked = true
        } else {
          input.checked = false
        }
      })
    } else {
      field.value = value
    }
  })
}

function showModal() {
  var modalBackground = document.querySelector(".js-modal-bg");
  var modal = document.querySelector(".js-modal");

  modalBackground.classList += " js-modal-bg--show"
  modal.classList += " js-modal--show"
}

function setupToggleFields() {
  var toggleFields = document.querySelectorAll("[data-toggle-on]")

  toggleFields.forEach(function(field) {
    var lookup = field.getAttribute("data-toggle-on")
    var triggerShow = field.getAttribute("data-trigger-show")
    var triggerElement = document.querySelector("[name='" + lookup + "']")

    if (triggerElement.value == triggerShow) {
      field.classList += " js-modal--show"
      field.querySelector("input").required = "true"
    }

    triggerElement.addEventListener("change", function(e) {
      if (triggerElement.value == triggerShow) {
        field.classList += " js-modal--show"
        field.querySelector("input").required = "true"
      } else {
        field.classList.remove("js-modal--show")
        field.querySelector("input").removeAttribute("required")
      }
    })
  })

}

var openModal = function(id) {
  prepopulateFields(id)
  setupToggleFields()
  showModal()
}
