var addBookButton = document.querySelector(".js-add-book");
var modal = document.querySelector(".js-modal");

addBookButton.addEventListener("click", function() {
  modal.classList += " books__modal--show"
});
