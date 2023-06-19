// const $viewContainer = document.querySelector('#button-container');
// const $buttons = document.querySelector('.button');
// const $views = document.querySelector('.view');

// $viewContainer.addEventListener('click', handleViewSwap);
// function handleViewSwap(event) {
//   if (!event.target.matches('button')) {
//     return;
//   }
//   for (let buttonIndex = 0; buttonIndex < $buttons.length; buttonIndex++) {
//     if ($buttons[buttonIndex] === event.target) {
//       $buttons[buttonIndex].className = 'tab active';
//     } else {
//       $buttons[buttonIndex].className = 'tab';
//     }
//   }
//   const viewName = event.target.getAttribute('data-view');
//   console.log($views);
//   for (let viewIndex = 0; viewIndex < $views.length; viewIndex++) {
//     if ($views[viewIndex].getAttribute('data-view') !== viewName) {
//       $views[viewIndex].className = 'view hidden';
//     } else {
//       $views[viewIndex].className = 'view';
//     }
//   }
// }

// document.addEventListener('DOMContentLoaded', function () {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://api.jikan.moe/v4/top/anime');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {

//     const data = xhr.response;
//     for (let i = 0; i < data.data.length; i++) {

//       const topAnime = renderTopAnime(data.data[i]);
//       $views.appendChild(topAnime);
//     }
//   });
//   xhr.send();
// }
// );
