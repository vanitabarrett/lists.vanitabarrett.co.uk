var initModal = function() {
  var statusInput = document.querySelector("#js-modal__status")

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
  statusInput.value = bookStatus;
  editIdInput.value = bookId;
}
