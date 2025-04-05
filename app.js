(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;
  ctrl.searchTerm = '';
  ctrl.found = [];
  ctrl.loading = false;
  ctrl.searched = false;

  ctrl.getMatchedMenuItems = function () {
    var term = ctrl.searchTerm.trim();
    ctrl.found = [];
    ctrl.searched = false;

    if (term === '') {
      ctrl.found = [];
      ctrl.searched = true;
      return;
    }

    ctrl.loading = true;

    MenuSearchService.getMatchedMenuItems(term)
      .then(function (items) {
        ctrl.found = items;
      })
      .finally(function () {
        ctrl.loading = false;
        ctrl.searched = true;
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
    return $http({
      method: "GET",
      url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
    }).then(function (response) {
      var allItems = response.data.menu_items;
      var matched = [];

      for (var i = 0; i < allItems.length; i++) {
        var description = allItems[i].description.toLowerCase();
        if (description.indexOf(searchTerm.toLowerCase()) !== -1) {
          matched.push(allItems[i]);
        }
      }

      return matched;
    });
  };
}

})();

