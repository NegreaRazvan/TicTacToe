const allCells=document.querySelectorAll(".cell");
let XCELLS=[];
let OCELLS=[];
let win=false;
const restart=document.querySelector(".restart")
const mode=document.getElementById("modes");
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

let matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


const board=document.getElementById('board');
let XTurn;

function start(){
    XTurn=true;
    restart.addEventListener('click',restartBoard);
    mode.addEventListener('click',restartBoard);
    allCells.forEach(cell => {
        cell.addEventListener('click',(e) => {
            if(mode.checked)
                handleClick(e);
            else
                vsPc(e);
        });
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
    matrix[Math.floor(index/3)][index%3]=0;
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
    restart.classList.remove('win');
    board.classList.remove('o');
    board.classList.add('x');
    matrix=[
        [0,0,0],
        [0,0,0],
        [0,0,0],
    ];
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
    restart.classList.add('win');
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

function makeMinimaxMatrix(index, mark){
    matrix[Math.floor(index/3)][index%3]=mark;
}

function winMiniMax(mat,mark){
    if(mat[0][1]==mark&&mat[0][2]==mark&&mat[0][0]==mark)
        return true;
    if(mat[1][1]==mark&&mat[1][2]==mark&&mat[1][0]==mark)
        return true;
    if(mat[2][1]==mark&&mat[2][2]==mark&&mat[2][0]==mark)
        return true;
    if(mat[0][1]==mark&&mat[1][1]==mark&&mat[2][1]==mark)
        return true;
    if(mat[0][0]==mark&&mat[1][0]==mark&&mat[2][0]==mark)
        return true;
    if(mat[0][2]==mark&&mat[1][2]==mark&&mat[2][2]==mark)
        return true;
    if(mat[0][0]==mark&&mat[1][1]==mark&&mat[2][2]==mark)
        return true;
    if(mat[0][2]==mark&&mat[1][1]==mark&&mat[2][0]==mark)
        return true;
    return false;
}

function minimax(MM,depth, AIturn){
    if(winMiniMax(MM,2)){
        return 10000;
    }
    if(winMiniMax(MM,1))
        return -10000;
    if(AIturn){
        let best=-1000;
        for(let i=0; i<3; i++)
            for(let j =0; j < 3; j++)
                if(MM[i][j]===0){
                    MM[i][j]=2;
                    let score=minimax(MM,depth+1, false);
                    MM[i][j]=0;
                    best=Math.max(score,best);

                }
        return best;
    }else{
        let best=1000;
        for(let i=0; i<3; i++)
            for(let j =0; j < 3; j++){
                if(MM[i][j]===0){
                    MM[i][j]=1;
                    let score=minimax(MM,depth+1, true);
                    MM[i][j]=0;
                    best=Math.min(score,best);
                }
            }
        return best;
    }
}

function bestMove(mat){
    let bestScore=-1000;
    let index=-1;
    let indexInCase=-1;
    for(let i=0;i<3;i++)
        for(let j=0;j<3;j++){
            if(mat[i][j]==0){
                if(indexInCase===-1)
                    indexInCase=i*3+j;
                mat[i][j]=2;
                console.log(mat);
                console.log(i);console.log(j);
                console.log('gata');
                console.log(mat[i][j]);
                console.log('gata2');
                let score=minimax(mat,0,false);
                mat[i][j]=0;
                console.log(score);
                if(score>=bestScore){
                    bestScore=score;
                    index=i*3+j;
                }
            }
        }
    if(index==-1)
        return indexInCase;
    return index;
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
            hoverEffect();
            if(XCELLS.length==3)
                pulsatingEffect(XCELLS);
            if(OCELLS.length==3)
                pulsatingEffect(OCELLS);
        }
    }
}

function vsPc(event){
    if(!win){
        const cell=event.target;
        let markPlaced = placeMark(cell,'x');
        if(markPlaced){
            let index=determineIndexClicked(cell);

            makeMinimaxMatrix(index,1);


            //add the mark
            addCellOcuppied(XTurn,index);

            //check if we need to remove the oldest mark
            if(XCELLS.length==4){
                delOldMark(XCELLS,'x');
            }

            //check for wins
            if(winner('x'))
                endGame(XCELLS);

            //switch turns
            XTurn=!XTurn;

            if(!win){
                let index1=0;
                if(OCELLS.length==0)
                {
                    index1=getRandomInt(9);
                    let ok=1,ok1=1;
                    while(true){
                        ok=0,ok1=0;
                        for(i of XCELLS){
                            if(index1===i){
                                ok=1;
                                break;
                            }
                        }
                        for(i of OCELLS){
                            if(index1===i){
                                ok1=1;
                                break;
                            }
                        }
                        if(ok||ok1)
                            index1=getRandomInt(9);
                        else
                            break;
                    }
                }else
                    index1=bestMove(matrix);
                makeMinimaxMatrix(index1,2);
                console.log(matrix);
                console.log(index1);
                let cell1,j=0;
                allCells.forEach(c => {
                    if(index1==j)
                        cell1=c;
                    j++;
                });
                placeMark(cell1,'o');
                addCellOcuppied(XTurn,index1);
                if(OCELLS.length==4)
                    delOldMark(OCELLS,'o');
                if(winner('o'))
                    endGame(OCELLS);
                XTurn=!XTurn;
            }
        }
        if(!win){
            hoverEffect();
            if(XCELLS.length==3)
                pulsatingEffect(XCELLS);
            if(OCELLS.length==3)
                pulsatingEffect(OCELLS);
        }
    }
}

start();