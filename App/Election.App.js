(function () {
    "use strict";

    angular.module("Election.App", [
        "Election.Component"
    ]);
})();

//Election Component
(function () {
    "use strict";
    console.log('something');

    angular.module("Election.Component", [
            "Election.Candidate.Component",
            "Election.Results.Component",
            "Election.Vote.Component"
        ])
        .component("tfElection", {
            templateUrl: "App/Election.Component.Template.html",
            controller: ElectionController,
            bindings: { }
        });

		ElectionController.$inject = [ "$timeout" ];

		function ElectionController($timeout){
			var ctrl = this;

			ctrl.candidates = [];

			ctrl.onCandidateCreate = function(candidate) {
				ctrl.candidates.push(candidate);
			};

			ctrl.onCandidateDelete = function(candidate) {
				var index = ctrl.candidates.indexOf(candidate);
				ctrl.candidates.splice(index, 1);
			};

			ctrl.onVote = function(candidate) {
				var index = ctrl.candidates.indexOf(candidate);
				ctrl.candidates[index].votes += 1;
        ctrl.sortVotes();
			};

      ctrl.sortVotes = function(){
        ctrl.candidates.sort(function(a, b){
          return b.votes - a.votes;
        });
      };

			ctrl.$onInit = function() {

				// Example Initial Data Request
				// Mimic 1 seconds ajax call
				$timeout(function(){
					ctrl.candidates = [
						{ name: "Puppies", color: "blue", votes: 65 },
						{ name: "Kittens", color: "red", votes: 62 },
						{ name: "Pandas", color: "green", votes: 5 },
            { name: "raptors", color: "purple", votes: 17 }
					];
          ctrl.sortVotes();
          // console.log(ctrl.candidates.sort(function(a, b){
          //   return b.votes - a.votes;
          // }));
				}, 1000);

			};

		}

})();

//Candidate Component
(function (angular) {
    "use strict";
    console.log('something');

    angular.module("Election.Candidate.Component", [])
        .component("tfElectionCandidate", {
            templateUrl: "App/Election.Candidate.Component.Template.html",
            controller: CandidateController,
            bindings: {
                onCreate: "&",
                onDelete: "&",
                candidates: "<"
            }
        });

		CandidateController.$inject = ['$scope'];

		function CandidateController($scope){

			var ctrl = this,
                buildNewCandidate = function() {
                    return {
                        votes: 0,
                        name: "",
                        color: null
                    };
                };

            ctrl.newCandidate = null;

            //TODO Add code to add a new candidate
            ctrl.addCandidate = function(){
              ctrl.candidates.push({name: ctrl.newCandidate.name, votes: 1});
            };


            //TODO Add code to remove a candidate
            ctrl.deleteCandidate = function(index) {
              console.log("index", index);
              ctrl.candidates.splice(index, 1);
            };

            // $onInit is called once at component initialization
            ctrl.$onInit = function () {
                ctrl.newCandidate = buildNewCandidate();
            };

		}

})(window.angular);

//Results Component
(function () {
    "use strict";
    console.log('something');

    angular.module("Election.Results.Component", [])
        .component("tfElectionResults", {
            templateUrl: "App/Election.Results.Component.Template.html",
            controller: ResultsController,
            bindings: {
                candidates: "<"
            }
        });

		ResultsController.$inject = [];

		function ResultsController(){
			var ctrl = this;
      var total;
            ctrl.getCandidatePercentage = function (votes) {
                total = _.sumBy(ctrl.candidates, "votes");
                if (total) {
                    return 100 * votes / total;
                }
                return 0;
            };
            ctrl.getCandidatePercentage();
            console.log("total", total);
		}

})();

//Vote Component
(function () {
    "use strict";
    console.log('something');

    angular.module("Election.Vote.Component", [])
        .component("tfElectionVote", {
            templateUrl: "App/Election.Vote.Component.Template.html",
            controller: VoteController,
            bindings: {
                candidates: "<",
                onVote: "&"
            }
        });

		VoteController.$inject = [];

		function VoteController(){
			var ctrl = this;

            ctrl.castVote = function (candidate) {
              console.log(candidate);
                ctrl.onVote({ $candidate: candidate });
            };


		}

})();
