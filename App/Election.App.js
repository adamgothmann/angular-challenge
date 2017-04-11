(function () {
    "use strict";

    angular.module("Election.App", [
        "Election.Component"
    ]);
})();

//Election Component
(function () {
    "use strict";

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

		ElectionController.$inject = [ "$timeout", "percentage" ];

		function ElectionController($timeout, percentage){
			var ctrl = this;

      // assigns getCandidatePercentage from service to ctrl.percentage.
      ctrl.percentage = percentage.getCandidatePercentage;

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
        ctrl.sortVotes(); // sorts the votes column each time a vote is cast.
        ctrl.percentage(ctrl.candidates); // calculates total vote % each time a vote is cast.
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
						{ name: "Puppies", color: "blue", votes: 65  },
						{ name: "Kittens", color: "red", votes: 62  },
						{ name: "Pandas", color: "green", votes: 5  }
					];

          ctrl.percentage(ctrl.candidates);
          ctrl.sortVotes();

				}, 1000);

			};

		}

})();

//Candidate Component
(function (angular) {
    "use strict";

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

		CandidateController.$inject = ["percentage"];

		function CandidateController(percentage){

			var ctrl = this,
                buildNewCandidate = function() {
                    return {
                        votes: 0,
                        name: "",
                        color: null
                    };
                };
            ctrl.percentage = percentage.getCandidatePercentage;

            ctrl.newCandidate = null;

            //TODO Add code to add a new candidate
            ctrl.addCandidate = function(){
              ctrl.candidates.push({name: ctrl.newCandidate.name, color: "", votes: 0, percentage: ctrl.percentage(ctrl.candidates)});
              ctrl.newCandidate.name = "";
            };


            //TODO Add code to remove a candidate
            ctrl.onCandidateDelete = function(candidate) {
      				var index = ctrl.candidates.indexOf(candidate);
      				ctrl.candidates.splice(index, 1);
              ctrl.percentage(ctrl.candidates);
      			};
            // MY CODE ↓
            // ctrl.deleteCandidate = function(index) {
            //   ctrl.candidates.splice(index, 1);
            //   ctrl.percentage(ctrl.candidates);
            // };

            // $onInit is called once at component initialization
            ctrl.$onInit = function () {
                ctrl.newCandidate = buildNewCandidate();
            };

		}

})(window.angular);

//Results Component
(function () {
    "use strict";

    angular.module("Election.Results.Component", [])
        .component("tfElectionResults", {
            templateUrl: "App/Election.Results.Component.Template.html",
            controller: ResultsController,
            bindings: {
                candidates: "<"
            }
        }) // my service to make getCandidatePercentage accessible from other controllers.
        .service("percentage", function(){
            this.getCandidatePercentage = function(candidates){
              for(var i = 0; i < candidates.length; i++){
                var total = _.sumBy(candidates, "votes");
                if (total) {
                    candidates[i].percentage = Math.round(100 * candidates[i].votes / total);
                  }
                }
                return 0;
            };
        });

		ResultsController.$inject = [];

		function ResultsController(){
  			var ctrl = this;

        ctrl.getCandidatePercentage = function (votes) {
                var total = _.sumBy(ctrl.candidates, "votes");
                if (total) {
                    return 100 * votes / total;
                }
                return 0;
        };
		}

})();

//Vote Component
(function () {
    "use strict";

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
                ctrl.onVote({ $candidate: candidate });
            };


		}

})();
