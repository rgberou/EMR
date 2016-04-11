/**
 * Created by kent on 2/12/2016.
 */

app.controller('DPSModalInstanceCtrl', function ($scope, $modalInstance, dpss, filterFilter, $state, $location) {

    $scope.dpss =  dpss;
    $scope.dps = {};
    $scope.id = '';
    //pagination and search
    $scope.search = {};
    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };
    $scope.setID = function(dps)
    {
        $scope.dps = dps;
        $scope.id = dps.SysPKDPS;

        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'active';
        $scope.lastSelected = this;
    };
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.dpss.length;
    $scope.entryLimit = 9; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    // $watch search to update pagination
    $scope.$watch('search', function (newVal, oldVal) {
        $scope.filtered = filterFilter($scope.dpss, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.currentPage = 1;
    }, true);

    $scope.selected = {
        item: $scope.dpss[0]
    };

    $scope.ok = function () {
        $scope.selected.item = $scope.dps;
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addNewSecretary = function(cjuncID){
        $state.go('adddoctorsecretary',{cjuncID: cjuncID})
        //$location.path('/sect-setup/addnew/' +cjuncID);
        $scope.cancel();
    }
});