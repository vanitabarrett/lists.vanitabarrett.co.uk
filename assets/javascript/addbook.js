var addBookButton = document.querySelector(".js-add-book");
var modalBackground = document.querySelector(".js-modal-bg");
var modal = document.querySelector(".js-modal");

addBookButton.addEventListener("click", function() {
  modalBackground.classList += " js-modal-bg--show"
  modal.classList += " js-modal--show"

});
