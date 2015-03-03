$(function(){
	//console.log("ready");
	
	// NOTE: I have started the Cell Array from 1... Hence the 0th location is blank
	var board = {};
	var puzzle = {};
		puzzle.imageWidth = 240;	//	$('#puzzleImg').height(); Since I have decided to take only 240x240 size image, So can be hard coded
	    board.cells = [];			//an array of cell bojects to hold information about all the board.cells
		board.m = 3; 				// say it is a m x m square puzzle
	    board.diffFactor = puzzle.imageWidth/board.m; 	//total width of teh borad divided by number of cell in each line i.e 231/3 = 77
		board.blankCellId;
		puzzle.totalMove = 0; 
		puzzle.totalTime = 0;
		puzzle.timerOn = false;
		puzzle.imageUrl = 'images/1.jpg';
	
	
	//set height and width of all necessary components
	$('#imageHolder').css({
		height: puzzle.imageWidth + 'px',
		width: puzzle.imageWidth + 'px'
	});
	$('#board1').css({
		height: puzzle.imageWidth + 'px',
		width: puzzle.imageWidth + 'px'
	});

	//console.log(board.diffFactor);
	$('.cell').css({
		height: board.diffFactor + 'px',
		width: board.diffFactor + 'px'
	});

	function initBoard() {		
		var cellNo = 0;
		board.cells = [];			//new board.cells array
		top=0, 				//top and left will temporarily hold the css top and left of a cell
		left=0;

		//add board.cells to the blank board
		for (var i=0; i<board.m; i++) {
			for (var j=0; j<board.m; j++) {
				cellNo++;
				board.cells[cellNo] = {};
				board.cells[cellNo].id = 'cell_'+cellNo;
				board.cells[cellNo].top = i*board.diffFactor;
				board.cells[cellNo].left = j*board.diffFactor;					
				
				$('<div class="cell" id="'+board.cells[cellNo].id+'"></div>').appendTo('#board1');
				$('#'+board.cells[cellNo].id).css({
					top : board.cells[cellNo].top + 'px',
					left : board.cells[cellNo].left + 'px',
					background: "url(" + puzzle.imageUrl + ") no-repeat -" + board.cells[cellNo].left + "px -" + board.cells[cellNo].top + "px"
				});
			}
		}

		//Now that we have board.cells, we set their height and width
		$('.cell').css({
			height: board.diffFactor + 'px',
			width: board.diffFactor + 'px'
		});

		//now clear the background image of the last cell, so that i shows a blank space
		board.blankCellId = board.cells[cellNo].id;
		$('#'+board.blankCellId).css('background-image','none');
	}	

	function init() {		
		puzzle.totalMove = 0;
		$('#totalMove').html(puzzle.totalMove);
		timerOn = false;
		totalTime = 0;
		$('#totalTime').html(totalTime);
		initBoard();
	}

	//Swap the cell with the blank cell, if it is allowable
	function swapIfSwappable (cellID) {
		var swapSuccessful = false;
		var thisLeft = parseInt($('#'+cellID).css('left'));
		var thisTop = parseInt($('#'+cellID).css('top'));
		var blankLeft = parseInt($('#'+board.blankCellId).css('left'));
		var blankTop = parseInt($('#'+board.blankCellId).css('top'));
		//console.log(thisLeft);
		if((thisLeft === blankLeft && Math.abs(thisTop - blankTop) === board.diffFactor) || (thisTop === blankTop && Math.abs(thisLeft - blankLeft) === board.diffFactor)) {
			//console.log('swappable');
			$('#'+cellID).css('left', $('#'+board.blankCellId).css('left'));
			$('#'+cellID).css('top', $('#'+board.blankCellId).css('top'));
			$('#'+board.blankCellId).css('left', thisLeft+'px');
			$('#'+board.blankCellId).css('top', thisTop+'px');
			swapSuccessful = true;
			puzzle.totalMove++;
		}
		else {
			//console.log('this is a non swappable block...');
		}

		return(swapSuccessful);
	}

	function shuffleUp () {
		//puzzle.totalMove = 0;
		var maxCellIndex = board.cells.length-1;
		var swapCount = 0;
		while (swapCount < 300)	{
			var randomCellIndex = Math.floor(Math.random() * maxCellIndex) + 1;
			if(swapIfSwappable('cell_'+randomCellIndex)) {
				swapCount++;
			}
		}
		//$('#puzzle.totalMove').html(totalMove);
	}

	function increaseTime () {
		totalTime = $('#totalTime').html();
		if(timerOn) {
			totalTime++;
			$('#totalTime').html(totalTime);
			setTimeout(increaseTime, 1000);
		}				
	}  


	//Initiate the puzzle board
	init();

	/*********************** ALL THE CLICK EVENTS ******************************/

	//Solve button is clicked
	$('#Solve').click(function(){
		$('#board1').html('');
		initBoard();
	});

	//Shuffle button is clicked
	$('#Shuffle').click(function(){
		shuffleUp();
		puzzle.totalMove = 0;
	});

	//Reset Counter button is pressed
	$('#resetCounter').click(function () {
		puzzle.totalMove = 0;
		timerOn = false;
		totalTime = 0;
		$('#totalMove').html(puzzle.totalMove);
		$('#totalTime').html(totalTime);
	});

	//Clicking on Start Timer
	$('#startTimer').click(function () {
		if(!timerOn) {
			timerOn = true;
			setTimeout(increaseTime, 1000);				
		}		
	});

	$('#stopTimer').click(function () {
		timerOn = false;
	});

	//CLICKING ON A CELL
	$('#board1').on('click', '.cell', function() {
		//Swap this cell with blank cell if this cell is swappable...		
		swapIfSwappable($(this).attr('id'));
		$('#totalMove').html(puzzle.totalMove);
	});

	//doneOptions button is clicked
	$('#selectLevel input[type=radio]').on('change', function () {
		board.m = parseInt($('#selectLevel input[type=radio]:checked').val());
		board.diffFactor = puzzle.imageWidth/board.m;
		$('#board1').html('');
		init();
	})

	//
	$('#selectImage li img').on('click', function () {
		//console.log($(this).attr('src'));
		puzzle.imageUrl = $(this).attr('src');
		$('#imageHolder img').attr('src', puzzle.imageUrl);
		$('#board1').html('');
		init();
	});

	//#optionsPanel is clicked
	$('#optionsPanel').click(function (e) {
		e.stopPropagation();
		$('#AllOptions').toggle();
	});

	$('html').click(function () {
		//console.log('body clicked');
		$('#AllOptions').hide();
		$('#imageHolder img').hide();
		$('#imageHolder span').show();
	});

	//imageHolder is clicked
	$('#imageHolder').click(function (e) {
		e.stopPropagation();
		$('#imageHolder img').toggle();
		$('#imageHolder span').toggle();
	});

});
