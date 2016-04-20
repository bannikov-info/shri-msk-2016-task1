;(function () {
    var module = angular.module('App', ['ngLorem', 'ngTouch'])
        .constant('CAST_TYPES', {
            'movie': 'Фильм',
            'sport': 'Спорт',
            'tv-series': 'Телесериал',
            'telecast': 'Телепередача'
        })
        .controller('AppCtrl', AppController)
        .directive('castTile', CastTileDirective)
        .run(function ($rootScope, CAST_TYPES) {
            $rootScope.castTypeTitle = function (type) {
                return CAST_TYPES[type] || type;
            }
        });

    AppController.$inject = ['$scope', '$http', 'CAST_TYPES', '$swipe'];
    function AppController($scope, $http, CAST_TYPES, $swipe) {
        $scope.channelCasts = {};

        $scope.viewPort = {
            w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        }

        $http({
            method:'GET',
            url: '/api/tv-casts/1channel.json'
        }).then(
            function (res) {
                // debugger
                $scope.channelCasts['1channel'] = res.data;
            }
        );

        $scope.date = function(v){
            return Date.parse(v);
        }

    }


    CastTileDirective.$inject = ['CAST_TYPES'];
    function CastTileDirective(CAST_TYPES) {
        return {
            restrict: 'A',
            templateUrl: '/tmpl/cast-tile.html',
            transclude:true,
            scope: {
                castTitle: '=',
                castTime: '=',
                castType: '=',
                castDetails: '='
            },
            link: function (scope, el, attrs) {
                el[0].classList.add('cast-tile');
            }
        }
    }


    module.directive('ngSwipeHorizontal', NgSwipeDirective);
    NgSwipeDirective.$inject = ['$rootScope', '$swipe'];
    function NgSwipeDirective($rootScope, $swipe) {
        return {
            restrict: 'AC',
            link: function (scope, el, attrs) {
                var snapLocations = JSON.parse(attrs.ngSwipeHorizontal);

                var startCoord = null;
                var startScrollLeft = 0;

                $swipe.bind(el, {
                    start: function (coord, ev) {
                        startCoord = coord;

                        var element = ev.currentTarget;
                        element.classList.remove('swipe-animate');
                        startScrollLeft = element.getBoundingClientRect().left;
                    },
                    move: function (coord, ev) {
                        if(!!startCoord){
                            var scrollLeft = startScrollLeft+(coord.x-startCoord.x);
                            scrollToPosition(ev.currentTarget, scrollLeft);
                        }
                    },
                    end: function (coord, ev) {
                        var scrollLeft = startScrollLeft+(coord.x-startCoord.x);
                        var min = calculateSnapPosition(scrollLeft);

                        var element = ev.currentTarget;
                        element.classList.add('swipe-animate');
                        scrollToPosition(element, min);

                        startCoord = null;
                    },
                    cancel: function (ev) {
                        startCoord = null;
                        scrollToPosition(ev.currentTarget, startScrollLeft);
                    }
                }, ['mouse', 'touch']);

                function calculateSnapPosition(position) {
                    // Used to store each difference between current position and each snap point.
                    var currentDiff;

                    // Used to store the current best difference.
                    var minimumDiff;

                    // User to store the best snap position.
                    var bestSnap;

                    // We're going to cycle through each snap location
                    // and work out which is closest to the current position.
                    for (var i=0; i < snapLocations.length; i++) {

                      // Calculate the difference.
                      currentDiff = Math.abs(position - snapLocations[i]);

                      // Works out if this difference is the closest yet.
                      if(minimumDiff === undefined || currentDiff < minimumDiff) {
                        minimumDiff = currentDiff;
                        bestSnap = snapLocations[i];
                      }
                    }

                    return bestSnap;
                }

                function scrollToPosition(el, positionX) {
                    el.style['-webkit-transform'] = 'translate3d`(' + positionX + 'px,0px,0px)';
                    el.style['transform'] = 'translate3d(' + positionX + 'px,0px,0px)';
                };
            }
        }
    }
}())
