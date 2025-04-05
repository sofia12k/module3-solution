(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDown = this;
  narrowItDown.searchTerm = "";
  narrowItDown.found = [];

  narrowItDown.getMatchedMenuItems = function () {
    if (narrowItDown.searchTerm.trim() === "") {
      narrowItDown.found = [];
      return;
    }

    var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);
    promise.then(function (response) {
      narrowItDown.found = response;
    })
    .catch(function (error) {
      console.log("Something went wrong.");
    });
  };

  narrowItDown.removeItem = function (itemIndex) {
    narrowItDown.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
    }).then(function (response) {
      var allItems = [];
      for (var category in response.data) {
        allItems = allItems.concat(response.data[category].menu_items);
      }
      var foundItems = allItems.filter(function (item) {
        return item.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return foundItems;
    });
  };
}

})();


