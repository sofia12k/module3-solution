=(function () {
'use strict';

angular.module('NarrowItDownApp')
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

})();
