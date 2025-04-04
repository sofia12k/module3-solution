(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;
  ctrl.searchTerm = "";
  ctrl.found = [];
  ctrl.errorMessage = "";

  ctrl.narrowItDown = function () {
    ctrl.errorMessage = "";
    if (!ctrl.searchTerm || ctrl.searchTerm.trim() === "") {
      ctrl.found = [];
      ctrl.errorMessage = "Nothing found";
      return;
    }

    MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
      .then(function (items) {
        ctrl.found = items;
        if (ctrl.found.length === 0) {
          ctrl.errorMessage = "Nothing found";
        }
      })
      .catch(function () {
        ctrl.errorMessage = "Error retrieving data.";
      });
  };

  ctrl.removeItem = function (index) {
    ctrl.found.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http.get("https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
      .then(function (response) {
        var allItems = response.data; // FIXED
        var foundItems = [];

        for (var i = 0; i < allItems.length; i++) {
          var description = allItems[i].description;
          if (description && description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(allItems[i]);
          }
        }

        return foundItems;
      });
  };
}

})();

