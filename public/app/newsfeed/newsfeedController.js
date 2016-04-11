/**
 * Created by kent on 11/12/2015.
 */

'use strict';

app.controller('NewsfeedCtrl', ['$scope', '$rootScope', '$location', '$interval', 'toastr', 'newsfeedDataFactory', 'oluserDataFactory', 'rfc4122',
    function($scope, $rootScope, $location, $interval, toastr, newsfeedDataFactory, oluoluserDataFactory, rfc4122) {

        $scope.newsfeeds = [];
        newsfeedDataFactory.getAllNewsfeeds().then(function(data) {
            $scope.newsfeeds = data.data;
        });
    }
]);

