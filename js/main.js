$(document).ready(function() {

	var ticTacToe = (function() {
		
		return {

			PLAYERS: {
				player: null,
				computer: null
			},

			UI: {
				$board: $('#ttt-area'),
				$chooser: $('#chooser'),
				$chooserInputs: $('#chooser input'),
				$playerDisplay: $('#player-display'),
				$sideDisplay: $('#player-side'),
				$td: $('td'),
				$reset: $('#reset'),
				$messages: $('#messages'),
				picked: [],
				aiPicked: []
			},

			gameWon: false,

			lastPick: null,

			Wins: [
				['a1','b1','c1'],
				['a2','b2','c2'],
				['a3','b3','c3'],

				['a1','a2','a3'],
				['b1','b2','b3'],
				['c1','c2','c3'],

				['a1','b2','c3'],
				['a3','b2','c1']
			],

			init: function() {

				ticTacToe.gameWon = false;
				ticTacToe.lastPick = null;
				ticTacToe.PLAYERS.player = null;
				ticTacToe.PLAYERS.computer = null;

				ticTacToe.UI.$chooser.removeClass('hidden');
				ticTacToe.UI.$playerDisplay.addClass('hidden');
				ticTacToe.UI.$chooserInputs.removeAttr('disabled').removeAttr('selected').prop('checked', false);
				ticTacToe.UI.$sideDisplay.text('');
				ticTacToe.UI.$td.text('').removeClass('picked').removeClass('aiPicked').removeClass('ready');
				ticTacToe.UI.$messages.text('').removeClass('text-danger').removeClass('text-success');
				ticTacToe.UI.$reset.text('Reset').addClass('hidden');

				ticTacToe.UI.picked = [];
				ticTacToe.UI.aiPicked = [];

				(function setHandlers() {

					ticTacToe.UI.$chooser.off('click.sideChooser').on('click.sideChooser', 'input', function(e) {
						ticTacToe.chooseSide($(e.currentTarget));
					});

					ticTacToe.UI.$reset.off('click.reset').on('click.reset', function(e) {
						ticTacToe.init();
					});

					ticTacToe.UI.$td.off('click.pickSquare').on('click.pickSquare', function(e) {
						ticTacToe.pickSquare($(e.currentTarget));
					});

				})();

			},

			chooseSide: function($targ) {
				ticTacToe.PLAYERS.player = $targ.val();
				if(ticTacToe.PLAYERS.player === 'X') {
					ticTacToe.PLAYERS.computer = 'O';
				} else {
					ticTacToe.PLAYERS.computer = 'X';
				}
				//console.log(ticTacToe.PLAYERS.player);
				ticTacToe.UI.$sideDisplay.text(ticTacToe.PLAYERS.player);
				ticTacToe.UI.$chooser.off('click.sideChooser');
				ticTacToe.UI.$chooserInputs.attr('disabled', true);
				ticTacToe.UI.$chooser.addClass('hidden');
				ticTacToe.UI.$playerDisplay.removeClass('hidden');
				ticTacToe.UI.$td.addClass('ready');
				ticTacToe.UI.$messages.text('');
				ticTacToe.UI.$reset.removeClass('hidden');
			},

			pickSquare: function($targ) {
				if(ticTacToe.PLAYERS.player) {
					if(!$targ.hasClass('picked') && !$targ.hasClass('aiPicked')) {
						$targ.text(ticTacToe.PLAYERS.player).addClass('picked');
						ticTacToe.UI.picked.push($targ.attr('id'));
						ticTacToe.lastPick = $targ.attr('id');
						ticTacToe.isWin();
					} else {
						ticTacToe.UI.$messages.text('That square has already been picked!').removeClass('text-danger').removeClass('text-success');
					}
				} else {
					ticTacToe.UI.$messages.text('Please choose a side first').removeClass('text-danger').removeClass('text-success');
				}
			},

			isWin: function(machine) {
				_.each(ticTacToe.Wins, function(val,key) {
					if(_.difference(val, ticTacToe.UI.picked).length < 1) {
						ticTacToe.UI.$messages.text('You Won!').removeClass('text-danger').addClass('text-success');
						ticTacToe.gameWon = true;
						ticTacToe.final();
					}
					if(_.difference(val, ticTacToe.UI.aiPicked).length < 1) {
						ticTacToe.UI.$messages.text('You Lost!').addClass('text-danger').removeClass('text-success');
						ticTacToe.gameWon = true;
						ticTacToe.final();
					}
				});
				if(!ticTacToe.gameWon && !machine) {
					//ticTacToe.machinePlay();
					ticTacToe.machinePlayHard();
				}
			},

			final: function() {
				ticTacToe.UI.$reset.text('Play Again');
				ticTacToe.UI.$td.off('click.pickSquare');
			},

			tieGame: function() {
				ticTacToe.UI.$messages.text('Tie Game.... try again?');
				ticTacToe.UI.$reset.text('Play Again');
				ticTacToe.UI.$td.off('click.pickSquare');
			},

			machinePlay: function() {
				var availableCels = ticTacToe.UI.$td.not('.picked').not('.aiPicked'),
					count = availableCels.length-1,
					choiceNumber = _.random(count);
				if(count === -1) {
					ticTacToe.tieGame();
				} else {
					$(availableCels[choiceNumber]).addClass('aiPicked').text(ticTacToe.PLAYERS.computer);
					ticTacToe.UI.aiPicked.push($(availableCels[choiceNumber]).attr('id'));
					ticTacToe.isWin(true);
				}
			},

			machinePlayHard: function() {
				var availableCels = ticTacToe.UI.$td.not('.picked').not('.aiPicked'),
					selectedWinArrays = [],
					aiPickCleanedWinArrays = [],
					cleanWinArraysSansUser = [],
					aiPicksFinal = [],
					choiceNumber,
					finalCount;

				// First, loop through each 'win' array....
				_.each(ticTacToe.Wins, function(val) {
					// ...and save only those that are still possible given current user picks,
					if(_.intersection(ticTacToe.UI.picked, val).length > 0) {
						selectedWinArrays.push(val);
					}
				});
				//console.log('Winning arrays that match the current user picks');
				//console.log(selectedWinArrays);
				//_.each(selectedWinArrays, function(cleanArray) {
					//console.log('initial win array: ', cleanArray);
				//});
				//console.log('------------------------------------');

				_.each(selectedWinArrays, function(arrayInstance) {
					var remove = false;
					//console.log('Possible winning array: ',arrayInstance);
					//console.log('Cels that are AI-picked: ', ticTacToe.UI.aiPicked);
					_.each(ticTacToe.UI.aiPicked, function(aiPickedValue) {
						//console.log($.inArray(aiPickedValue,arrayInstance));
						if($.inArray(aiPickedValue,arrayInstance) !== -1) {
							remove = true;
						}
					});
					if(remove === false) {
						aiPickCleanedWinArrays.push(arrayInstance);
					}
				});
				//console.log('Remaining after cleanup: ', aiPickCleanedWinArrays);

				//console.log('------------------------------------');

				_.each(aiPickCleanedWinArrays, function(cleanArray) {
					//console.log('Final Winning Array: ', cleanArray, ' len: ', cleanArray.length);
					var interimArray = [];
					_.each(cleanArray, function(cel) {
						//console.log('Is cel ', cel, ' in ', ticTacToe.UI.picked, '?');
						if($.inArray(cel,ticTacToe.UI.picked) === -1) {
							interimArray.push(cel);
						}
					});
					cleanWinArraysSansUser.push(interimArray);
				});

				//console.log('------------------------------------');

				//console.log('Clean win arrays, minus user selections: ');

				var shortest = null,
					arraysOfOne = 0,
					theRest = [];

				_.each(cleanWinArraysSansUser, function(val) {
					//console.log(val);
					if(val.length === 1) {
						arraysOfOne += 1;
						//console.log('Whats diff here? ', val);
						shortest = val.toString();
					}
					_.each(val, function(innerVal) {
						theRest.push(innerVal);
					});

				});

				//console.log('AI current picks: ', ticTacToe.UI.aiPicked);
				
				if(arraysOfOne === 1) {
					var target = _.find(availableCels, function(val) {
						if($(val).attr('id') === shortest) {
							//console.log(val);
							return val;
						}
					});
					//console.log('Urgent, must stop the attack!', shortest);
					//console.log('Operate on this: ', target);
					$(target).addClass('aiPicked').text(ticTacToe.PLAYERS.computer);
					ticTacToe.UI.aiPicked.push(shortest);

				} else {

					//console.log('have to dedupe this, then randomly pick: ', theRest);
					aiPicksFinal = _.uniq(theRest);
					//console.log('is this right?: ', theRest);
					finalCount = aiPicksFinal.length-1;
					choiceNumber = _.random(finalCount);

					//console.log('Selected cel: ', $(availableCels[choiceNumber]));

					$(availableCels[choiceNumber]).addClass('aiPicked').text(ticTacToe.PLAYERS.computer);
					ticTacToe.UI.aiPicked.push($(availableCels[choiceNumber]).attr('id'));

				}

				if(theRest.length === 0) {
					ticTacToe.tieGame();
				} else {
					ticTacToe.isWin(true);
				}

			}

		};

	})();

	ticTacToe.init();

});