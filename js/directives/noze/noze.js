(function () {
    'use strict';
    angular
        .module('bubblot')
        .directive('noze', nozeDirective);

    function nozeDirective() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/noze/noze.html',
            replace: true,
            controller: 'nozeCtrl',
            controllerAs: 'vm',
            scope: {
                circleSize: '=', circleThickness: '=', turbidity: '=', magnetism: '='
            },
        }
    }
} ());
