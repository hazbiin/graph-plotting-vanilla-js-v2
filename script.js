const gridContainer = document.querySelector(".grid-container");
const actionBtn = document.getElementById("draw-mark-clear-btn");
const resetBTn = document.getElementById("reset-btn");

const maxXSize = document.getElementById("max-X-input");
const maxYSize = document.getElementById("max-Y-input");

const xInput = document.getElementById("x-axis-input");
const YInput = document.getElementById("y-axis-input");


// initial states 
let drawState = true;
let markState = false;
let clearState = false;

if(drawState) {
    xInput.disabled = true;
    YInput.disabled = true;
}

actionBtn.addEventListener("click", () => {

    // taking inputs
    const maxX = Number(maxXSize.value); // x axis length
    const maxY = Number(maxYSize.value); // y axis length
    const xToPlot = xInput.value;
    const yToPlot = YInput.value;

    // calling function based on states 
    if(drawState) {
        draw(maxX, maxY, gridContainer);
    }else if(markState) {
        mark(xToPlot, yToPlot, maxX, maxY);
    }else if(clearState) {
        clear(xToPlot, yToPlot);   
    }
})


// ----------------draw function------------------------
function draw(xAxis, yAxis, gridContainer) {
    if(!xAxis || !yAxis || (xAxis <= 0) || (yAxis <= 0)) {
        alert("Invalid grid dimensions specified!");
        return;
    }

    // in grid rows and columns are flipping
    gridContainer.style.gridTemplateRows = `repeat(${yAxis}, minmax(10px, 50px))`;
    gridContainer.style.gridTemplateColumns = `repeat(${xAxis}, minmax(10px, 50px))`;
    gridContainer.innerHTML = "";

    // populating with blocks 
    for(let i = yAxis - 1; i >= 0; i--) { //row
        for(let j = 0; j < xAxis; j++) { //column
            const block = document.createElement("div");
            block.classList.add('block');
            block.dataset.xy = `${j},${i}`;
            block.textContent = `${j},${i}`;
            gridContainer.appendChild(block);
        }
    }

    actionBtn.textContent = "Mark";
    actionBtn.classList.add("clicked");
    maxXSize.disabled = true;
    maxYSize.disabled = true;

    xInput.disabled = false;
    YInput.disabled = false;

    // changing states
    drawState = false;
    markState = true;
}

// ---------------mark funciton----------------------------
function mark(xToPlot, yToPlot, xAxis, yAxis) {

    // validation of empty inputs.
    if(xToPlot === "" || yToPlot === "") {
        alert("x and y points are required for marking!");
        return;
    }

    // converting to number and proceeding, as 0 is valid in our case
    let x = Number(xToPlot);
    let y = Number(yToPlot);


    // validation of correct x and y points
    if((x >= xAxis) || (y >= yAxis) || (x < 0) || (y < 0)) {
        alert("x or y point does not includes in the grid generated");
        return;
    }

    // only mark if these conditions met
    if(x!== null && y!== null && (x < xAxis) && (y < yAxis)) {
        const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${y}"]`);

        blockToColor.style.backgroundColor = "blueviolet";
        actionBtn.textContent = "Clear";

        // changing states
        markState = false;
        clearState = true;
    }
}

// ------------clear function--------------------
function clear(x, y) {
    const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${y}"]`);

    blockToColor.style.backgroundColor = "";
    actionBtn.textContent = "Mark";
    xInput.value = '';
    YInput.value = '';

    // changing states
    clearState = false;
    markState = true;
}


// ---------------reset funciton------------------
function clearDrawState() {
    gridContainer.innerHTML = "";
    actionBtn.textContent = "Draw";
    actionBtn.classList.remove("clicked");

    maxXSize.disabled = false;
    maxYSize.disabled = false;
    maxXSize.value = "";
    maxYSize.value = "";

    xInput.value = "";
    YInput.value = "";
    xInput.disabled = true;
    YInput.disabled = true;

    drawState = true;
    markState = false;
}

resetBTn.addEventListener("click", () => {

    if(markState) {
        clearDrawState();
    }else if(clearState) {
        clearDrawState();
        xInput.value = "";
        YInput.value = "";
        xInput.disabled = true;
        YInput.disabled = true;
        clearState = false;
    }else {
        alert("nothing to reset!");
    }
});






// let drawState = true;
// let markState = false;

// if(drawState) {
//     xInput.disabled = true;
//     YInput.disabled = true;
// }


// actionBtn.addEventListener("click", () => {
//     const maxX = Number(maxXSize.value); //row size
//     const maxY = Number(maxYSize.value); //column size

//     if(drawState){

//         // drawing logic 
//         if(!maxX || !maxY || (maxX <= 0) || (maxY <= 0)) {
//             alert("Invalid grid dimensions specified!");
//             return;
//         }

//         // in grid rows and columns are flipping
//         gridContainer.style.gridTemplateRows = `repeat(${maxY}, minmax(10px, 50px))`;
//         gridContainer.style.gridTemplateColumns = `repeat(${maxX}, minmax(10px, 50px))`;
//         gridContainer.innerHTML = "";

//         // populating with blocks 
//         for(let i = maxY - 1; i >= 0; i--) { //row
//             for(let j = 0; j < maxX; j++) { //column
//                 const block = document.createElement("div");
//                 block.classList.add('block');
//                 block.dataset.xy = `${j},${i}`;
//                 block.textContent = `${j},${i}`;
//                 gridContainer.appendChild(block);
//             }
//         }

//         drawState = false;
//         markState = true;
//         actionBtn.textContent = "Mark";
//         actionBtn.classList.add("clicked");
//         maxXSize.disabled = true;
//         maxYSize.disabled = true;

//         xInput.disabled = false;
//         YInput.disabled = false;
//     }
    

//     // // marking logic
//     const xToPlot = Number(xInput.value);
//     const yToPlot = Number(YInput.value);

//     // if((!xToPlot || !yToPlot) && !drawState) {
//     //     alert("x and y points are not specified to mark the point!");
//     // }

//     // validating with correct plot points
//     if((xToPlot >= maxX) || (yToPlot >= maxY)) {
//         alert("x or y point does not includes in the grid generated");
//         return;
//     }

//     // only mark if these conditions met
//     if(xToPlot!== null && yToPlot!== null && (xToPlot < maxX) && (yToPlot < maxY)) {
//         markPoint(xToPlot, yToPlot);
//     }
// })


// function markPoint(x, y) {
//     console.log("fun called")
//     const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${y}"]`);

//     if(x && y && !markState){ 
//         blockToColor.style.backgroundColor = "blueviolet";
       
//         markState = true;
//         actionBtn.textContent = "Clear";
//     }else {
//         blockToColor.style.backgroundColor = "";

//         markState = false;
//         actionBtn.textContent = "Mark";
//         xInput.value = '';
//         YInput.value = '';
//     }
// }


// resetBTn.addEventListener("click", () => {
//     if(!drawState || markState) {
//         gridContainer.innerHTML = "";
//         drawState = true;
//         actionBtn.textContent = "Draw";
//         actionBtn.classList.remove("clicked");
    
//         maxXSize.disabled = false;
//         maxYSize.disabled = false;
//         maxXSize.value = "";
//         maxYSize.value = "";
    
//         xInput.disabled = true;
//         YInput.disabled = true;
        
//         if(markState) {
//             markState = false;
//         }
       
//         xInput.value = "";
//         YInput.value = "";
//         xInput.disabled = true;
//         YInput.disabled = true;
//     }
// })