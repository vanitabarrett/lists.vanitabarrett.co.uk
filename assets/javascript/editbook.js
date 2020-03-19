var editBook = function() {
  var modalBackground = document.querySelector(".js-modal-bg");
  var modal = document.querySelector(".js-modal");
  var editStatusInput = document.querySelector("#js-edit-book__status")

  var parentRow = event.target.closest(".js-edit-book")
  var parentCells = parentRow.querySelectorAll(".book__table-cell")
  var bookId = parentRow.getAttribute("id")
  var bookTitle = parentCells[0].innerText
  var bookAuthor = parentCells[1].innerText
  var bookStatus = parentCells[2].querySelector(".js-book-status").innerText

  var editIdInput = document.querySelector("#js-edit-book__id")
  var editTitleInput = document.querySelector("#js-edit-book__title")
  var editAuthorInput = document.querySelector("#js-edit-book__author")

  editTitleInput.value = bookTitle;
  editAuthorInput.value = bookAuthor;
  editStatusInput.value = bookStatus;
  editIdInput.value = bookId;

  modalBackground.classList += " js-modal-bg--show"
  modal.classList += " js-modal--show"

  editStatusInput.addEventListener("change", function(e) {
    if (editStatusInput.value == "4") {
      var editYearFieldWrapper = document.querySelector(".js-edit-book__year-wrapper")

      editYearFieldWrapper.classList += " js-edit-book__year-wrapper--show"
    }
  })
}
