(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.directive('itemsLoaderIndicator', LoaderIndicatorDirective);

// Main controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDown = this;

  narrowItDown.searchTerm = "";
  narrowItDown.found = [];
  narrowItDown.searched = false;
  narrowItDown.loading = false;

  narrowItDown.getMatchedMenuItems = function () {
    narrowItDown.searched = true;
    narrowItDown.loading = true;

    if (!narrowItDown.searchTerm) {
      narrowItDown.found = [];
      narrowItDown.loading = false;
      return;
    }

    MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
      .then(function (foundItems) {
        narrowItDown.found = foundItems;
        narrowItDown.loading = false;
      });
  };

  narrowItDown.removeItem = function (index) {
    narrowItDown.found.splice(index, 1);
  };
}

// Service
MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
    }).then(function (response) {
      var foundItems = [];
      var items = response.data.menu_items;

      for (var i = 0; i < items.length; i++) {
        var description = items[i].description.toLowerCase();
        if (description.indexOf(searchTerm.toLowerCase()) !== -1) {
          foundItems.push(items[i]);
        }
      }
      return foundItems;
    });
  };
}

// found-items directive
function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

// loader directive
function LoaderIndicatorDirective() {
  var ddo = {
    templateUrl: 'itemsloaderindicator.template.html'
  };
  return ddo;
}

})();
