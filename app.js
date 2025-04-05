(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  // Directive
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
      ctrl.searched = false;
      ctrl.loading = true;

      if (!ctrl.searchTerm || ctrl.searchTerm.trim() === '') {
        ctrl.loading = false;
        ctrl.searched = true;
        return;
      }

      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (foundItems) {
          console.log(foundItems); // Log found items to verify the data
          ctrl.found = foundItems;
          ctrl.loading = false;
          ctrl.searched = true;
        });
    };

    ctrl.removeItem = function (itemIndex) {
      ctrl.found.splice(itemIndex, 1);
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
      }).then(function (result) {
        console.log(result.data); // Log API response to ensure the structure is correct

        if (result.data && result.data.menu_items) {
          var allItems = result.data.menu_items;
          var foundItems = [];

          for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              foundItems.push(allItems[i]);
            }
          }

          return foundItems;
        } else {
          console.error('No menu items found in response');
          return [];
        }
      });
    };
  }

})();
