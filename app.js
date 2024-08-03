const allCells=document.querySelectorAll(".cell");
let XCELLS=[];
let OCELLS=[];
let win=false;
const restart=document.querySelector(".restart")
const winCond=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [2,4,6],
    [0,4,8],
    [1,4,7],
    [2,5,8]
]


const board=document.getElementById('board');
let XTurn;

function start(){
    XTurn=true;
    restart.addEventListener('click',restartBoard);
    allCells.forEach(cell => {
        cell.addEventListener('click',handleClick)
    });
    hoverEffect();
}

/**
 * places the mark on the cell provided, with the mark provided
 * @param {*} cell - the cell which will be occupied
 * @param {*} currentClass - the mark which will occupy the cell
 * @returns true or false so we can know if the mark was placed succesfully of not
 *          helps to know if we need to handle the click or not
 */
function placeMark(cell, currentClass){
    if(!cell.classList.contains('x')&&!cell.classList.contains('o')){
        cell.classList.add(currentClass);
        return true;
    }
    return false;
}

/**
 * the hover effect, that also indicates who's turn it is
 */
function hoverEffect(){
    board.classList.remove('x');
    board.classList.remove('o');
    if(XTurn)
        board.classList.add('x');
    else
        board.classList.add('o');
    
}

/**
 * function that determines wheter or not there is a winning combination
 */
function winner(currentClass){
    return winCond.some(combination =>{
        return combination.every(index => {
            return allCells[index].classList.contains(currentClass);
        })
    })
}

/*
determine which cell was clicked
*/
function determineIndexClicked(cell){
    let index=0;
    for(object of allCells){
        if(object===cell)
            break;
        index=index+1;
    }
    return index
}

/*
adds the cell in the array of it's respective turn
*/
function addCellOcuppied(turn,index){
    if(turn)
        XCELLS.push(index);
    else
        OCELLS.push(index);
}

/**
 * deletes the oldest mark on the board from the respective class
 * @param {*} list the list from which the index needs to be deleted (OCELLS or XCELLS)
 * @param {*} mark in order to remove the class from the list 
 */
function delOldMark(list,mark){
    const oldMark=list[0];
    list.shift();
    let index=0;
    let cell;
    for(object of allCells){
        if(index===oldMark){
            cell=object;
            break;
        }
        index++;
    }
    cell.classList.remove(mark);
    cell.classList.remove('pulsate');
}

/**
 * gives a pulsating effect to the oldest move of the respective mark
 * @param {*} list - OCELLS or XCELLS, depending on who's turn it was 
 */
function pulsatingEffect(list){
    const oldMark=list[0];
    let index=0;
    let cell;
    for(object of allCells){
        if(index===oldMark){
            cell=object;
            break;
        }
        index++;
    }
    cell.classList.add('pulsate');
}

/**
 * make the board clean
 */
function restartBoard(){
    allCells.forEach(cell => {
        cell.classList.remove('o');
        cell.classList.remove('x');
        cell.classList.remove('pulsate');
        cell.classList.remove('win');
    });
    XCELLS.length=0;
    OCELLS.length=0;
    win=false;
    board.classList.add('x');
    XTurn=true;
}

/**
 * finish the game we were in, because someone was declared winner
 * @param {*} list - OCELLS or XCELLS, to animate the winning combination
 */
function endGame(list){
    win=true;
    board.classList.remove('x');
    board.classList.remove('o');
    console.log(board.classList);
    console.log('winner');
    console.log(list);
    allCells.forEach(cell => {
        cell.classList.remove('pulsate');
    });
    for(index of list){
        let i=0;
        for(object of allCells){
            if(index===i){
                object.classList.add('win');
                break;
            }
            i++;
        }
    }
}


function handleClick(event){
    if(!win){
        const cell=event.target;
        const currentClass = XTurn ? 'x' : 'o';
        let markPlaced = placeMark(cell,currentClass);
        if(markPlaced){
            let index=determineIndexClicked(cell);

            //add the mark
            addCellOcuppied(XTurn,index);

            //check if we need to remove the oldest mark
            if(XCELLS.length==4)
                delOldMark(XCELLS,'x');
            if(OCELLS.length==4)
                delOldMark(OCELLS,'o');

            //check for wins
            if(winner(currentClass))
                endGame(XTurn ? XCELLS : OCELLS);
            
            //switch turns
            XTurn=!XTurn;
        }
        if(!win){
            console.log('not a win');
            hoverEffect();
            if(XCELLS.length==3)
                pulsatingEffect(XCELLS);
            if(OCELLS.length==3)
                pulsatingEffect(OCELLS);
        }
    }
}

start();