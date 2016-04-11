/**
 * Created by kent on 10/7/2015.
 */

app.controller('EmployeeModalInstanceCtrl', function ($scope, $modalInstance, employees,filterFilter) {

    $scope.employees = employees;
    $scope.employee = {};
    $scope.id = '';
    //pagination and search
    $scope.search = {};
    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };
    $scope.setID = function(employee)
    {
        $scope.id = employee.SysPK_Empl;

        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'active';
        $scope.lastSelected = this;
    };
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.employees.length;
    $scope.entryLimit = 9; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    // $watch search to update pagination
    $scope.$watch('search', function (newVal, oldVal) {
        $scope.filtered = filterFilter($scope.employees, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.currentPage = 1;
    }, true);

    $scope.selected = {
        item: $scope.employees[0]
    };

    $scope.ok = function (employee) {
        $scope.selected.item = employee;
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});