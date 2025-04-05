(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  // === Controller ===
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = '';
    ctrl.found = [];
    ctrl.nothingFound = false;

    ctrl.narrowDown = function () {
      if (!ctrl.searchTerm) {
        ctrl.found = [];
        ctrl.nothingFound = true;
        return;
      }

      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (items) {
          ctrl.found = items;
          ctrl.nothingFound = items.length === 0;
        });
    };

    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  // === Service ===
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
        .then(function (response) {
          var allItems = response.data.menu_items;
          var foundItems = allItems.filter(function (item) {
            return item.description.toLowerCase().includes(searchTerm.toLowerCase());
          });
          return foundItems;
        });
    };
  }

  // === Directive ===
  function FoundItemsDirective() {
    return {
      restrict: 'E',
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      template: `
        <ul class="list-group">
          <li class="list-group-item" ng-repeat="item in foundItems track by $index">
            {{ item.name }}, {{ item.short_name }}, {{ item.description }}
            <button class="btn btn-danger btn-sm float-end" ng-click="onRemove({index: $index})">Don't want this one!</button>
          </li>
        </ul>
      `
    };
  }

})();
