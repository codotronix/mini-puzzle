$(function(){
	//console.log("ready");
	
	// NOTE: I have started the Cell Array from 1... Hence the 0th location is blank

	var imageWidth = $('#puzzleImg').height();
	var cells = [];			//an array of cell bojects to hold information about all the cells
	var m = 3; 				// say it is a m x m square puzzle
	var diffFactor = imageWidth/m; 	//total width of teh borad divided by number of cell in each line i.e 231/3 = 77
	var blankCellId;
	var totalMove = 0; 
	var totalTime = 0;
	var timerOn = false;
	
	
	//set height and width of all necessary components
	$('#imageHolder').css({
		height: imageWidth + 'px',
		width: imageWidth + 'px'
	});
	$('#board1').css({
		height: imageWidth + 'px',
		width: imageWidth + 'px'
	});
	$('#secScoreBoard').css({
		height: imageWidth + 'px',
		width: imageWidth +'px'
	});

	//console.log(diffFactor);
	$('.cell').css({
		height: diffFactor + 'px',
		width: diffFactor + 'px'
	});

	function initBoard() {		
		var cellNo = 0;
		cells = [];			//new cells array
		top=0, 				//top and left will temporarily hold the css top and left of a cell
		left=0;

		//add cells to the blank board
		for (var i=0; i<m; i++) {
			for (var j=0; j<m; j++) {
				cellNo++;
				cells[cellNo] = {};
				cells[cellNo].id = 'cell_'+cellNo;
				cells[cellNo].top = i*diffFactor;
				cells[cellNo].left = j*diffFactor;					
				
				$('<div class="cell" id="'+cells[cellNo].id+'"></div>').appendTo('#board1');
				$('#'+cells[cellNo].id).css({
					top : cells[cellNo].top + 'px',
					left : cells[cellNo].left + 'px',
					background: "url('images/puzzle.jpg') no-repeat -" + cells[cellNo].left + "px -" + cells[cellNo].top + "px"
				});
			}
		}

		//Now that we have Cells, we set their height and width
		$('.cell').css({
			height: diffFactor + 'px',
			width: diffFactor + 'px'
		});

		//now clear the background image of the last cell, so that i shows a blank space
		blankCellId = cells[cellNo].id;
		$('#'+blankCellId).css('background-image','none');
	}	

	function init() {
		initBoard();
	}

	//Swap the cell with the blank cell, if it is allowable
	function swapIfSwappable (cellID) {
		var swapSuccessful = false;
		var thisLeft = parseInt($('#'+cellID).css('left'));
		var thisTop = parseInt($('#'+cellID).css('top'));
		var blankLeft = parseInt($('#'+blankCellId).css('left'));
		var blankTop = parseInt($('#'+blankCellId).css('top'));
		//console.log(thisLeft);
		if((thisLeft === blankLeft && Math.abs(thisTop - blankTop) === diffFactor) || (thisTop === blankTop && Math.abs(thisLeft - blankLeft) === diffFactor)) {
			//console.log('swappable');
			$('#'+cellID).css('left', $('#'+blankCellId).css('left'));
			$('#'+cellID).css('top', $('#'+blankCellId).css('top'));
			$('#'+blankCellId).css('left', thisLeft+'px');
			$('#'+blankCellId).css('top', thisTop+'px');
			swapSuccessful = true;
			totalMove++;
		}
		else {
			//console.log('this is a non swappable block...');
		}

		return(swapSuccessful);
	}

	function shuffleUp () {
		totalMove = 0;
		var maxCellIndex = cells.length-1;
		var swapCount = 0;
		while (swapCount < 300)	{
			var randomCellIndex = Math.floor(Math.random() * maxCellIndex) + 1;
			if(swapIfSwappable('cell_'+randomCellIndex)) {
				swapCount++;
			}
		}
		$('#totalMove').html(totalMove);
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
	});

	//Reset Counter button is pressed
	$('#resetCounter').click(function () {
		totalMove = 0;
		timerOn = false;
		totalTime = 0;
		$('#totalMove').html(totalMove);
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
		$('#totalMove').html(totalMove);
	});

	//doneOptions button is clicked
	$('#doneOptions').click(function () {
		m = parseInt($('#selectLevel input[type=radio]:checked').val());
		diffFactor = imageWidth/m;
		$('#board1').html('');
		init();	
	});
});