/**
 * Created by kent on 2/5/2016.
 */
app.controller('ClinicModalInstanceCtrl', function ($scope, $modalInstance, clinics, filterFilter) {
    $scope.clinics = clinics;
    $scope.clinic = {};
    $scope.id = '';
    //pagination and search
    $scope.search = {};
    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };

    $scope.setID = function(clinic)
    {
        $scope.clinic = clinic;
        $scope.id = clinic.SysPK_Clinic;
        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'active';
        $scope.lastSelected = this;
    };

    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.clinics.length;
    $scope.entryLimit = 9; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    // $watch search to update pagination
    $scope.$watch('search', function (newVal, oldVal) {
        $scope.filtered = filterFilter($scope.clinics, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.currentPage = 1;
    }, true);

    $scope.selected = {
        item: $scope.clinics[0]
    };

    $scope.ok = function () {
        $scope.selected.item = $scope.clinic;
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {
        $modalInstance.close();
    };
});
