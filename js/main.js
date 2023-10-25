var $homeForm = document.querySelector('#home-form');
var $homePage = document.querySelector('[data-view="home-page"]');
var $nav = document.querySelector('[data-view="nav"]');
var $navHeader = document.querySelector('#nav-header');
var $main = document.querySelector('main');
var $navForm = document.querySelector('#nav-form');
var $body = document.querySelector('body');
var $moviePage = document.querySelector('[data-view="movie-page"]');
var $close = document.querySelector('.fa-xmark');
var $plus = document.querySelector('.fa-plus');
var $check = document.querySelector('.fa-check');
var $list = document.querySelector('#list');
var $listBtn = document.querySelector('[data-item="list-btn"]');
var $minus = document.querySelector('.fa-minus');
var $modal = document.querySelector('.modal');
var $no = document.querySelector('.no');
var $yes = document.querySelector('.yes');
var $loading = document.querySelector('.loading');
var $banner = document.querySelector('.banner');

$list.addEventListener('click', viewList);
$listBtn.addEventListener('click', viewList);

$minus.addEventListener('click', function () {
  $modal.classList.remove('hidden');

});

$yes.addEventListener('click', function () {
  for (var i = 0; i < data.list.array.length; i++) {
    if (data.movieView.currentlyViewing.imdbID === data.list.array[i].imdbID) {
      data.list.array.splice(i, 1);
      $moviePage.classList.add('hidden');
      $modal.classList.add('hidden');
      viewList();
    }
  }
});

$no.addEventListener('click', function () {
  $modal.classList.add('hidden');
});

$navHeader.addEventListener('click', function (event) {
  var $container = document.querySelectorAll('.container');
  for (var i = 0; i < $container.length; i++) {
    $container[i].classList.add('hidden');
  }
  data.pageView = 'home';
  $homePage.classList.remove('hidden');
  $homeForm.reset();
  $navForm.reset();
  if (data.list.viewing === true) {
    var $listPage = document.querySelector('[data-view="list-page"]');
    var $searchResult = document.querySelector('[data-view="search-result"]');

    $listPage.remove();
    if (data.pageView === 'home') {
      $homePage.classList.remove('hidden');
      $nav.classList.add('hidden');
    } else if (data.pageView === 'search') {
      $navForm.classList.remove('hidden');
      $searchResult.classList.remove('hidden');
      $list.classList.remove('hidden');
    }

    $minus.classList.add('hidden');
    data.list.viewing = false;
  }
});

$navForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var $navInput = document.querySelector('#nav-input');
  data.search = $navInput.value;
  getApi(data.search);
});

$homeForm.addEventListener('submit', function (event) {
  var $navInput = document.querySelector('#nav-input');
  var $homeInput = document.querySelector('#home-input');
  data.search = $homeInput.value;
  event.preventDefault();
  $homePage.classList.add('hidden');
  $nav.classList.remove('hidden');
  $navForm.classList.remove('hidden');
  $navInput.value = data.search;
  getApi(data.search);
  data.pageView = 'search';
  $banner.classList.add('hidden');

});

function getApi(keyword) {
  $loading.classList.remove('hidden');
  data.searchData = [];
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://omdbapi.com/?apikey=e9abc53b&s=' + keyword);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.Response === 'False') {
      $main.appendChild(createContainer(false));
      $loading.classList.add('hidden');
      return;
    }
    for (var i = 0; i < xhr.response.Search.length; i++) {
      if (xhr.response.Search[i].Poster !== 'N/A') {
        data.searchData.push(xhr.response.Search[i]);
      }
    }
    if (data.searchData.length === 0) {
      $main.appendChild(createContainer(false));
      $loading.classList.add('hidden');
      return;
    }
    $loading.classList.add('hidden');
    $main.appendChild(createContainer());
  });
  xhr.addEventListener('error', function () {
    $main.appendChild(createContainer('networkError'));
    $loading.classList.add('hidden');

  });
  xhr.send();
}

function createContainer(value) {
  var $searchResult = document.querySelector('[data-view="search-result"]');
  var container = document.createElement('div');
  container.setAttribute('class', 'container text-center');

  var row = document.createElement('div');
  row.setAttribute('class', 'row');

  if (data.list.viewing === false) {
    if ($searchResult) {
      $searchResult.remove();
    }

    container.setAttribute('data-view', 'search-result');

    if (value === false) {
      var p2 = document.createElement('p');
      p2.textContent = 'No movies found, try again.';
      p2.className = 'no-movies empty-search-error';
      container.appendChild(p2);
      return container;
    } else if (value === 'networkError') {
      p2 = document.createElement('p');
      p2.textContent = 'Sorry there is a network error, try again later.';
      p2.className = 'no-movies empty-search-error';
      container.appendChild(p2);
      return container;
    }

    for (var i = 0; i < data.searchData.length; i++) {
      row.appendChild(createColumn(data.searchData[i]));
    }

  } else {
    container.setAttribute('data-view', 'list-page');
    var tempList = data.list.array;
    row.setAttribute('class', 'row');

    var columnOneFourth = document.createElement('div');
    columnOneFourth.className = 'column-one-fourth list-close-container';
    row.appendChild(columnOneFourth);

    var close = document.createElement('i');
    close.className = 'fa-solid fa-xmark';
    close.setAttribute('id', 'list-close');
    columnOneFourth.appendChild(close);

    var row2 = document.createElement('div');
    row2.className = 'row';

    var p = document.createElement('p');
    p.textContent = 'No movies added.';
    p.className = 'no-movies hidden';
    p.setAttribute('id', 'empty-list-error');
    container.appendChild(p);

    for (var z = 0; z < tempList.length; z++) {
      row2.appendChild(createColumn(tempList[z]));
    }
  }

  container.appendChild(row);
  if (row2) {
    container.appendChild(row2);
  }
  return container;

}
$body.addEventListener('click', function (event) {
  var $listPage = document.querySelector('[data-view="list-page"]');
  if (event.target.matches('img')) {
    $list.classList.add('hidden');
    if (data.list.viewing === true) {
      $listPage.classList.add('hidden');
      for (var z = 0; z < data.list.array.length; z++) {
        if (data.list.array[z].Poster === event.target.getAttribute('src')) {
          data.movieView.currentlyViewing = data.list.array[z];
          getDetails(data.list.array[z].imdbID);
          $plus.classList.add('hidden');
          $check.classList.add('hidden');
          $minus.classList.remove('hidden');
          $banner.remove('hidden');
        }
      }
    } else {
      for (var i = 0; i < data.searchData.length; i++) {
        if (data.searchData[i].Poster === event.target.getAttribute('src')) {
          data.movieView.currentlyViewing = (data.searchData[i]);
          if (movieAdded() === true) {
            $plus.classList.add('hidden');
            $check.classList.remove('hidden');
            $banner.remove('hidden');
          } else {
            $plus.classList.remove('hidden');
            $check.classList.add('hidden');
            $banner.remove('hidden');
          }
          getDetails(data.movieView.currentlyViewing.imdbID);
        }
      }
    }
  }

  if (event.target.getAttribute('id') === 'list-close') {
    var $searchResult = document.querySelector('[data-view="search-result"]');

    $listPage.remove();
    if (data.pageView === 'home') {
      $homePage.classList.remove('hidden');
      $nav.classList.add('hidden');
    } else if (data.pageView === 'search') {
      $navForm.classList.remove('hidden');
      $searchResult.classList.remove('hidden');
      $list.classList.remove('hidden');
      $banner.remove('hidden');
    }

    $minus.classList.add('hidden');
    data.list.viewing = false;
  }
});

$close.addEventListener('click', function () {

  if (data.list.viewing === true) {
    $moviePage.classList.add('hidden');
    viewList();
  } else {
    var $searchResult = document.querySelector('[data-view="search-result"]');
    $moviePage.classList.add('hidden');
    $navForm.classList.remove('hidden');
    $searchResult.classList.remove('hidden');
    $check.classList.add('hidden');
    $list.classList.remove('hidden');
    $banner.remove('hidden');
    if (movieAdded() === true) {
      $plus.classList.add('hidden');
      $check.classList.remove('hidden');
    } else {
      $plus.classList.remove('hidden');
      $check.classList.add('hidden');
    }
  }

});

function getDetails(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://omdbapi.com/?apikey=e9abc53b&i=' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.movieView.info = xhr.response;
    setMoviePage(data.movieView.info);
    var $searchResult = document.querySelector('[data-view="search-result"]');
    $moviePage.classList.remove('hidden');
    $navForm.classList.add('hidden');
    if ($searchResult) {
      $searchResult.classList.add('hidden');
    }
  });
  xhr.send();
}

function setMoviePage(movie) {
  var $movieTitle = document.querySelector('#movie-title');
  var $movieDirector = document.querySelector('#movie-director');
  var $rated = document.querySelector('#rated');
  var $score = document.querySelector('#score');
  var $genre = document.querySelector('#genre');
  var $actors = document.querySelector('#actors');
  var $plot = document.querySelector('#plot');
  var $img = document.querySelector('.movie-page-img');

  $movieTitle.textContent = movie.Title;
  $movieDirector.textContent = 'Directed by ' + movie.Director;
  $rated.textContent = movie.Rated;
  $genre.textContent = movie.Genre;
  $actors.textContent = movie.Actors;
  $plot.textContent = movie.Plot;
  $img.setAttribute('src', movie.Poster);

  for (var i = 0; i < movie.Ratings.length; i++) {
    if (movie.Ratings[i].Source === 'Internet Movie Database') {
      $score.textContent = movie.Ratings[i].Value;
    }
  }
}

$plus.addEventListener('click', function () {
  data.list.array.unshift(data.movieView.currentlyViewing);
  if (movieAdded() === true) {
    $plus.classList.add('hidden');
    $check.classList.remove('hidden');
  } else {
    $plus.classList.remove('hidden');
    $check.classList.add('hidden');
  }
});

function movieAdded() {
  var added = false;
  for (var i = 0; i < data.list.array.length; i++) {
    if (data.movieView.currentlyViewing.imdbID === data.list.array[i].imdbID) {
      added = true;
    }
  }

  return added;

}

function viewList() {
  var $searchResult = document.querySelector('[data-view="search-result"]');

  if (data.list.viewing === true) {
    var $listPage = document.querySelector('[data-view="list-page"]');
    $listPage.remove();
    if (data.pageView === 'home') {
      $homePage.classList.remove('hidden');
      $nav.classList.add('hidden');
    } else if (data.pageView === 'search') {
      $navForm.classList.remove('hidden');
      $searchResult.classList.remove('hidden');
      $list.classList.remove('hidden');
    }

    $minus.classList.add('hidden');
    data.list.viewing = false;
  }
  $list.classList.add('hidden');
  $moviePage.classList.add('hidden');
  data.list.viewing = true;
  $navForm.classList.add('hidden');
  $homePage.classList.add('hidden');
  $nav.classList.remove('hidden');
  if ($searchResult) {
    $searchResult.classList.add('hidden');
  }
  $main.appendChild(createContainer());
  var $emptyList = document.querySelector('#empty-list-error');
  if (isListEmpty() === true) {
    $emptyList.classList.remove('hidden');
  } else {
    $emptyList.classList.add('hidden');
  }
}

function createColumn(movie) {
  var column = document.createElement('div');
  column.setAttribute('class', 'column-one-third margin-auto');
  var img = document.createElement('img');
  img.setAttribute('src', movie.Poster);
  column.appendChild(img);
  return column;
}

function isListEmpty() {
  var listEmpty = false;
  if (data.list.array.length === 0) {
    listEmpty = true;
  }
  return listEmpty;
}
