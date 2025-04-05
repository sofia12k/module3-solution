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
      var term = ctrl.searchTerm.trim();
      if (!term) {
        ctrl.found = [];
        ctrl.nothingFound = true;
        return;
      }

      MenuSearchService.getMatchedMenuItems(term)
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
      template:
        `<ul class="list-group mt-3">
          <li class="list-group-item d-flex justify-content-between align-items-start"
              ng-repeat="item in foundItems track by $index">
            <div>
              <strong>{{ item.name }}</strong> ({{ item.short_name }})<br>
              <small>{{ item.description }}</small>
            </div>
            <button class="btn btn-danger btn-sm"
                    ng-click="onRemove({index: $index})">
              Don't want this one!
            </button>
          </li>
        </ul>`
    };
  }

})();
