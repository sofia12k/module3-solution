(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    template:
      '<ul>' +
        '<li ng-repeat="item in found">' +
          '{{ item.name }} ({{ item.short_name }}) - {{ item.description }}' +
          ' <button class="btn btn-danger btn-sm" ng-click="onRemove({index: $index})">' +
            'Remove' +
          '</button>' +
        '</li>' +
      '</ul>',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDown = this;
  narrowItDown.searchTerm = "";
  narrowItDown.found = [];
  narrowItDown.searched = false;

  narrowItDown.getMatchedMenuItems = function () {
    narrowItDown.searched = true;
    if (!narrowItDown.searchTerm.trim()) {
      narrowItDown.found = [];
      return;
    }

    MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
      .then(function (foundItems) {
        narrowItDown.found = foundItems;
      });
  };

  narrowItDown.removeItem = function (index) {
    narrowItDown.found.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: 'GET',
      url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
    }).then(function (result) {
      var allItems = [];
      for (var category in result.data) {
        allItems = allItems.concat(result.data[category].menu_items);
      }

      var found = allItems.filter(function (item) {
        return item.description.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return found;
    });
  };
}

})();
