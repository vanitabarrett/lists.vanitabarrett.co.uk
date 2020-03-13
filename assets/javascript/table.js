var options = {
  numberPerPage:10,
  constNumberPerPage:10,
  numberOfPages:0,
  goBar: false,
  pageCounter:false,
  hasPagination:true,
};

var filterOptions = {
  el:'#js-search-input'
};

paginate.init('#js-book-table', options, filterOptions);

