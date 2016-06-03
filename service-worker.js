var dataCacheName = 'offline-1';
var cacheName = 'offline';
var filesToCache = [
'/',
'index.html',
'offline.html',
'view/about.html',
'view/academics.html',
'view/blog.html',
'view/intro.html',
'view/projects.html',
'js/intro.js',
'js/about.js',
'js/academics.js',
'js/blog.js',
'js/project.js',
'js/app.js',
'img/blog/AngularJS--6--1.jpg',
'img/blog/U87M5vo.png',
'img/exam.jpeg',
'img/fav.png',       
'img/favicon.ico',
'img/faviconn.png',
'img/mohit.jpg',
'img/sac.jpg',
'img/blog/mifos_color.jpg',
'data/about.json',
'data/academics.json',
'data/blog.json',
'data/projects.json',
'bower_components/angular/angular.js',
'bower_components/angular/angular.min.js'
];


 self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheName)
        .then(function(cache) {
          return cache.addAll(filesToCache);
        })
    );
    event.waitUntil(self.skipWaiting());
  });

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['offline-1'];

  event.waitUntil(
    caches.keys(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
 
  // Network, then cache, then fallback for home page
  if(requestURL=='/')  {
    event.respondWith(
      fetch(event.request).then(function() {
        return caches.match(event.request);
      }).catch(function() {
        return caches.match('offline.html');
      })
    );
  }
 
  // Cache, then network, then fallback for other urls
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function() {
      return caches.match('offline.html');
    })
  );
});