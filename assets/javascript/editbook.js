var editBookButtons = document.querySelectorAll(".js-edit-book");
var modalBackground = document.querySelector(".js-modal-bg");
var modal = document.querySelector(".js-modal");
var editStatusInput = document.querySelector("#js-edit-book__status")

editBookButtons.forEach(function(row) {
  row.addEventListener("click", function(e) {
    var parentRow = e.target.closest(".js-edit-book")
    var parentCells = parentRow.querySelectorAll(".book__table-cell")
    var bookTitle = parentCells[0].innerText
    var bookAuthor = parentCells[1].innerText
    var bookStatus = parentCells[2].querySelector(".js-book-status").innerText

    var editTitleInput = document.querySelector("#js-edit-book__title")
    var editAuthorInput = document.querySelector("#js-edit-book__author")

    editTitleInput.value = bookTitle;
    editAuthorInput.value = bookAuthor;
    editStatusInput.value = bookStatus;

    modalBackground.classList += " js-modal-bg--show"
    modal.classList += " js-modal--show"
  });
})

editStatusInput.addEventListener("change", function(e) {
  if (editStatusInput.value == "4") {
    var editYearFieldWrapper = document.querySelector(".js-edit-book__year-wrapper")

    editYearFieldWrapper.classList += " js-edit-book__year-wrapper--show"
  }
})
