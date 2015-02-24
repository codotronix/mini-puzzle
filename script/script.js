$(function(){
	console.log("ready");

	
	// NOTE: I have started the Cell Array from 1... Hence the 0th location is blank

	var cells = [];			//an array of cell bojects to hold information about all the cells
	var m = 3; 				// say it is a m x m square puzzle
	var diffFactor = 77; 	//total width of teh borad divided by number of cell in each line i.e 231/3 = 77
	var blankCellId;
	

	function initBoard() {		
		var cellNo = 0;
		top=0, 				//top and left will temporarily hold the css top and left of a cell
		left=0;

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
		//now clear the background image of the last cell, so that i shows a blank space
		//console.log(cellNo);
		blankCellId = cells[cellNo].id;
		$('#'+blankCellId).css('background-image','none');
	}

	function jumbleUp () {
		var totalCells = cells.length;

		for (var i=0; i<100; i++) {
			//generate a random number between 1 and totalCells-1
			// NOTE: I have started the Cell Array from 1... Hence the 0th location is blank
			var CellIndex1 = Math.floor((Math.random() * totalCells-1)) + 1;
			var CellIndex2 = Math.floor((Math.random() * totalCells-1)) + 1;
			//console.log(CellIndex1 + " " + CellIndex2);

			//To Ensure that ZERO Index Doesnot Come
			if(CellIndex1<1) {
				CellIndex1 = 1;
			}
			if(CellIndex2<1) {
				CellIndex2 = 1;
			}

			if (CellIndex1 !== CellIndex2) {
				var tempTop = cells[CellIndex1].top;
				var tempLeft = cells[CellIndex1].left;

				cells[CellIndex1].top = cells[CellIndex2].top;
				cells[CellIndex1].left = cells[CellIndex2].left;

				cells[CellIndex2].top = tempTop;
				cells[CellIndex2].left = tempLeft;
			} 
		}
	}

	function reDraw (recvCells) {
		for(var i=1; i<recvCells.length; i++){
			$('#'+recvCells[i].id).css({
				top : recvCells[i].top + 'px',
				left : recvCells[i].left + 'px'
			})
		}
	}

	function init() {
		initBoard();
	}

	
	//Solve button is clicked
	$('#Solve').click(function(){
		//reDraw(OriginalCells);
		$('#board1').html('');
		initBoard();
	});

	//Shuffle button is clicked
	$('#Shuffle').click(function(){
		jumbleUp();
		reDraw(cells);
	});


	//Initiate the puzzle board
	init();

	$('#board1').on('click', '.cell', function() {
		//console.log('Clicked on ' + $(this).attr('id'));
		var thisLeft = parseInt($(this).css('left'));
		var thisTop = parseInt($(this).css('top'));
		var blankLeft = parseInt($('#'+blankCellId).css('left'));
		var blankTop = parseInt($('#'+blankCellId).css('top'));
		//console.log(thisLeft);
		if((thisLeft === blankLeft && Math.abs(thisTop - blankTop) === diffFactor) || (thisTop === blankTop && Math.abs(thisLeft - blankLeft) === diffFactor)) {
			//console.log('swappable');
			$(this).css('left', $('#'+blankCellId).css('left'));
			$(this).css('top', $('#'+blankCellId).css('top'));
			$('#'+blankCellId).css('left', thisLeft+'px');
			$('#'+blankCellId).css('top', thisTop+'px');
		}
		else {
			console.log('non swappable block');
		}

	});
});