const addNewBtn = document.getElementById('add-new-btn');
const templatesContainer = document.getElementById('templates-container');

addNewBtn.addEventListener("click", () => {
    const newTemplate = document.createElement("div");
    newTemplate.classList.add('container');
    newTemplate.innerHTML = `
         <div class="top-section">
            <div class="inputs-container">

                <div class="input-group">
                    <div class="input-container">
                        <p>max-X:</p>
                        <input class="input-box max-X-input" type="number" min="1"/>
                    </div>
                    <div class="input-container">
                        <p>max-Y:</p>
                        <input class="input-box max-Y-input" type="number" min="1"/>
                    </div>
                    <div class="input-container">
                        <p>x-axis:</p>
                        <input class="input-box x-axis-input" type="number"/>
                    </div>
                    <div class="input-container">
                        <p>y-axis:</p>
                        <input class="input-box y-axis-input" type="number"/>
                    </div>
                </div>
                
                <div class="input-group">
                    <button class="btn action-btn">Draw</button>
                </div>
                
            </div>
        </div>
        <div class="bottom-section">
            <diV>
                <button class="btn reset-btn">
                    <i class="bi bi-arrow-clockwise"></i>
                    <span>Reset</span>
                </button>
            </diV>
            <div class="grid-scrollable-container">
                <div class="grid-container">
                </div>
            </div>
        </div>
    `;

    templatesContainer.appendChild(newTemplate);

    const gridContainer = newTemplate.querySelector('.grid-container');
    const actionBtn = newTemplate.querySelector('.action-btn');
    const resetBtn = newTemplate.querySelector('.reset-btn');
    
    const maxXSize = newTemplate.querySelector('.max-X-input');
    const maxYSize = newTemplate.querySelector('.max-Y-input');

    const xInput = newTemplate.querySelector('.x-axis-input');
    const YInput = newTemplate.querySelector('.y-axis-input');


    // assigning same objects to a variable and both refers to the same memory
    const state = newTemplate.stateObj = {
        drawState : true,
        markState : false,
        clearState : false,
    }

    if(state.drawState) {
        xInput.disabled = true;
        YInput.disabled = true;
    }

    // attaching event handlers 
    actionBtn.addEventListener("click", () => {

        // taking inputs
        const maxX = Number(maxXSize.value); // x axis length
        const maxY = Number(maxYSize.value); // y axis length
        const xToPlot = xInput.value;
        const yToPlot = YInput.value;

        const drawConfigObj = {
            maxX,
            maxY,
            gridContainer,
            maxXSize,
            maxYSize,
            xInput,
            YInput,
            actionBtn,
            state
        }

        const markConfigObj = {
            xToPlot,
            yToPlot,
            maxX,
            maxY,
            gridContainer,
            actionBtn,
            state
        }

        const clearConfigObj = {
            xToPlot,
            yToPlot,
            gridContainer,
            actionBtn,
            state,
            xInput,
            YInput
        }

        // calling function based on states 
        if(state.drawState) {
            // draw(maxX, maxY, gridContainer);

            draw(drawConfigObj);
            console.log(state); // draw state false and mark state is true

        }else if(state.markState) {
            // mark(xToPlot, yToPlot, maxX, maxY);

            mark(markConfigObj);
            console.log(state) // mark state is false and clear state is true 

        }else if(state.clearState) {
            // clear(xToPlot, yToPlot);   

            clear(clearConfigObj)
            console.log(state) // clear state is false and mark state is true 
        }
    })


    const resetStateObj = {
        gridContainer,
        actionBtn,
        maxXSize,
        maxYSize,
        xInput,
        YInput,
        state
    }

    resetBtn.addEventListener("click", () => {
        if(state.markState) {

            // console.log("from mark state herere");
            resetState(resetStateObj);
            state.markState = false;
            // console.log("new state",state);

        }else if(state.clearState) {

            // console.log("from clear state")
            resetState(resetStateObj)
            state.clearState = false;
            // console.log("new state",state);

        }else {
            alert("nothing to reset!");
        }
    });
})

// ----------------draw function------------------------
function draw({maxX, maxY, gridContainer, maxXSize, maxYSize, xInput, YInput, actionBtn, state}) {
    // console.log(maxX, maxY, gridContainer, maxXSize, maxYSize, xInput, YInput, actionBtn, state)

    if(!maxX || !maxY || (maxX <= 0) || (maxY <= 0)) {
        alert("Invalid grid dimensions specified!");
        return;
    }

    // in grid rows and columns are flipping
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateRows = `repeat(${maxY}, minmax(10px, 50px))`;
    gridContainer.style.gridTemplateColumns = `repeat(${maxX}, minmax(10px, 50px))`;
    gridContainer.innerHTML = "";

    // populating with blocks 
    for(let i = maxY - 1; i >= 0; i--) { //row
        for(let j = 0; j < maxX; j++) { //column
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
    state.drawState = false;
    state.markState = true;
}


// ---------------mark funciton----------------------------
function mark({xToPlot, yToPlot, maxX, maxY, gridContainer,actionBtn, state }) {
    // console.log(xToPlot, yToPlot, maxX, maxY, gridContainer,actionBtn, state);

    // validation of empty inputs.
    if(xToPlot === "" || yToPlot === "") {
        alert("x and y points are required for marking!");
        return;
    }

    // converting to number and proceeding, as 0 is valid in our case
    let x = Number(xToPlot);
    let y = Number(yToPlot);


    // validation of correct x and y points
    if((x >= maxX) || (y >= maxY) || (x < 0) || (y < 0)) {
        alert("x or y point does not includes in the grid generated");
        return;
    }

    // only mark if these conditions met
    if(x!== null && y!== null && (x < maxX) && (y < maxY)) {
        
        for(let i = 0; i <= y; i++) {
            const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${i}"]`);
            blockToColor.style.backgroundColor = "blueviolet";
        }
       
        actionBtn.textContent = "Clear";

        // changing states
        state.markState = false;
        state.clearState = true;
    }
}

// ------------clear function--------------------
function clear({xToPlot, yToPlot, gridContainer, actionBtn, state, xInput, YInput}) {
    // console.log(xToPlot, yToPlot, gridContainer, actionBtn, state, xInput, YInput)

    for(let i = 0; i <= yToPlot; i++) {
        const blockToColor = gridContainer.querySelector(`[data-xy = "${xToPlot},${i}"]`);
        blockToColor.style.backgroundColor = "";
    }

    actionBtn.textContent = "Mark";
    xInput.value = '';
    YInput.value = '';

    // changing states
    state.clearState = false;
    state.markState = true;
}

// ---------------reset funciton------------------
function resetState({gridContainer, actionBtn, maxXSize, maxYSize, xInput, YInput, state}) {
    gridContainer.innerHTML = "";
    gridContainer.style.display = 'none';
    actionBtn.textContent = "Draw";
    actionBtn.classList.remove("clicked");

    maxXSize.disabled = false;
    maxYSize.disabled = false;
    maxXSize.value = "";
    maxYSize.value = "";
            
    xInput.disabled = true;
    YInput.disabled = true;
    xInput.value = "";
    YInput.value = "";
    state.drawState = true;
}






// ----------------------------------------------old code -----------------------------------------
// const gridContainer = document.querySelector(".grid-container");
// const actionBtn = document.getElementById("draw-mark-clear-btn");
// const resetBTn = document.getElementById("reset-btn");

// const maxXSize = document.getElementById("max-X-input");
// const maxYSize = document.getElementById("max-Y-input");

// const xInput = document.getElementById("x-axis-input");
// const YInput = document.getElementById("y-axis-input");


// // initial states 
// let drawState = true;
// let markState = false;
// let clearState = false;

// if(drawState) {
//     xInput.disabled = true;
//     YInput.disabled = true;
// }

// actionBtn.addEventListener("click", () => {

//     // taking inputs
//     const maxX = Number(maxXSize.value); // x axis length
//     const maxY = Number(maxYSize.value); // y axis length
//     const xToPlot = xInput.value;
//     const yToPlot = YInput.value;

//     // calling function based on states 
//     if(drawState) {
//         draw(maxX, maxY, gridContainer);
//     }else if(markState) {
//         mark(xToPlot, yToPlot, maxX, maxY);
//     }else if(clearState) {
//         clear(xToPlot, yToPlot);   
//     }
// })



// // ----------------draw function------------------------
// function draw(xAxis, yAxis, gridContainer) {
//     if(!xAxis || !yAxis || (xAxis <= 0) || (yAxis <= 0)) {
//         alert("Invalid grid dimensions specified!");
//         return;
//     }

//     // in grid rows and columns are flipping
//     gridContainer.style.gridTemplateRows = `repeat(${yAxis}, minmax(10px, 50px))`;
//     gridContainer.style.gridTemplateColumns = `repeat(${xAxis}, minmax(10px, 50px))`;
//     gridContainer.innerHTML = "";

//     // populating with blocks 
//     for(let i = yAxis - 1; i >= 0; i--) { //row
//         for(let j = 0; j < xAxis; j++) { //column
//             const block = document.createElement("div");
//             block.classList.add('block');
//             block.dataset.xy = `${j},${i}`;
//             block.textContent = `${j},${i}`;
//             gridContainer.appendChild(block);
//         }
//     }

//     actionBtn.textContent = "Mark";
//     actionBtn.classList.add("clicked");
//     maxXSize.disabled = true;
//     maxYSize.disabled = true;

//     xInput.disabled = false;
//     YInput.disabled = false;

//     // changing states
//     drawState = false;
//     markState = true;
// }

// // j

// // ---------------mark funciton----------------------------
// function mark(xToPlot, yToPlot, xAxis, yAxis) {

//     // validation of empty inputs.
//     if(xToPlot === "" || yToPlot === "") {
//         alert("x and y points are required for marking!");
//         return;
//     }

//     // converting to number and proceeding, as 0 is valid in our case
//     let x = Number(xToPlot);
//     let y = Number(yToPlot);


//     // validation of correct x and y points
//     if((x >= xAxis) || (y >= yAxis) || (x < 0) || (y < 0)) {
//         alert("x or y point does not includes in the grid generated");
//         return;
//     }

//     // only mark if these conditions met
//     if(x!== null && y!== null && (x < xAxis) && (y < yAxis)) {
        
//         for(let i = 0; i <= y; i++) {
//             const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${i}"]`);
//             blockToColor.style.backgroundColor = "blueviolet";
//         }
       
//         actionBtn.textContent = "Clear";

//         // changing states
//         markState = false;
//         clearState = true;
//     }
// }

// // ------------clear function--------------------
// function clear(x, y) {

//     for(let i = 0; i <= y; i++) {
//         const blockToColor = gridContainer.querySelector(`[data-xy = "${x},${i}"]`);
//         blockToColor.style.backgroundColor = "";
//     }
//     actionBtn.textContent = "Mark";
//     xInput.value = '';
//     YInput.value = '';

//     // changing states
//     clearState = false;
//     markState = true;
// }


// // ---------------reset funciton------------------
// function clearDrawState() {
//     gridContainer.innerHTML = "";
//     actionBtn.textContent = "Draw";
//     actionBtn.classList.remove("clicked");

//     maxXSize.disabled = false;
//     maxYSize.disabled = false;
//     maxXSize.value = "";
//     maxYSize.value = "";

//     xInput.value = "";
//     YInput.value = "";
//     xInput.disabled = true;
//     YInput.disabled = true;

//     drawState = true;
//     markState = false;
// }

// resetBTn.addEventListener("click", () => {

//     if(markState) {
//         clearDrawState();
//     }else if(clearState) {
//         clearDrawState();
//         xInput.value = "";
//         YInput.value = "";
//         xInput.disabled = true;
//         YInput.disabled = true;
//         clearState = false;
//     }else {
//         alert("nothing to reset!");
//     }
// });