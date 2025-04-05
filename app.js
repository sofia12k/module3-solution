(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

// Directive
function FoundItemsDirective() {
  return {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
}

// Controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;

  ctrl.searchTerm = '';
  ctrl.found = [];
  ctrl.searched = false;
  ctrl.loading = false;

  ctrl.getMatchedMenuItems = function () {
    ctrl.found = [];
    ctrl.searched = true;
    ctrl.loading = true;

    var trimmedTerm = ctrl.searchTerm.trim();
    if (!trimmedTerm) {
      ctrl.loading = false;
      return;
    }

    MenuSearchService.getMatchedMenuItems(trimmedTerm)
      .then(function (foundItems) {
        ctrl.found = foundItems;
      })
      .finally(function () {
        ctrl.loading = false;
      });
  };

  ctrl.removeItem = function (index) {
    ctrl.found.splice(index, 1);
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
      var menuItems = response.data.menu_items || [];
      var foundItems = menuItems.filter(function (item) {
        return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
      });
      return foundItems;
    });
  };
}

})();

