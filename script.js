const addNewBtn = document.getElementById('add-new-btn');
const templatesContainer = document.getElementById('templates-container');

addNewBtn.addEventListener("click", () => {

    // getting count of each templates 
    let maxCount = 0;
    templatesContainer.querySelectorAll('.container').forEach(el => {
        const count = parseInt(el.dataset.count || "0", 10);
        if(count > maxCount) maxCount = count;
    })
    const currentCount = maxCount + 1;
    
    const newTemplate = document.createElement("div");
    newTemplate.classList.add('container');
    newTemplate.dataset.count = currentCount;
    newTemplate.innerHTML = `
        <div class="top-section">
            <div class="graph-details">
                <p class="graph-name">graph template ${currentCount}</p>
                <button class="remove-template-btn">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
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
                    <div class="input-container">
                        <p>fill-color:</p>
                        <input class="input-box fill-color-input" type="color" value="#000000"/>
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
                    <span>reset</span>
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
    const removeTemplateBtn = newTemplate.querySelector('.remove-template-btn');
    
    const maxXInput = newTemplate.querySelector('.max-X-input');
    const maxYInput = newTemplate.querySelector('.max-Y-input');

    const xInput = newTemplate.querySelector('.x-axis-input');
    const yInput = newTemplate.querySelector('.y-axis-input');

    const fillColorInput = newTemplate.querySelector('.fill-color-input');

    // assigning same objects to a variable and both refers to the same memory
    const states = newTemplate.stateObj = {
        drawState : true,
        markState : false,
        clearState : false,
    }
    const fields = {
        gridContainer,
        actionBtn,
        maxXInput,
        maxYInput,
        xInput,
        yInput,
        fillColorInput
    }
    const inputs = {
        maxX: null,
        maxY: null,
        xToPlot: null,
        yToPlot: null,
        fillColor: null,
    }

    // final object which is passed into functions
    const allConfigObj = {
        inputs,
        fields,
        states
    }

    if(states.drawState) {
        xInput.disabled = true;
        yInput.disabled = true;
        fillColorInput.disabled = true;
    }

    // ---------------action button event handler --------------
    actionBtn.addEventListener("click", () => {
        // taking inputs
        inputs.maxX = Number(maxXInput.value); // x axis length
        inputs.maxY = Number(maxYInput.value); // y axis length
        inputs.xToPlot = xInput.value;
        inputs.yToPlot = yInput.value;
        inputs.fillColor = fillColorInput.value;

        // calling function based on states 
        if(states.drawState) {
            // draw(maxX, maxY, gridContainer);

            draw(allConfigObj);
            // console.log(state); // draw state false and mark state is true

        }else if(states.markState) {
            // mark(xToPlot, yToPlot, maxX, maxY);

            mark(allConfigObj);
            // console.log(state) // mark state is false and clear state is true 

        }else if(states.clearState) {
            // clear(xToPlot, yToPlot);   

            clear(allConfigObj);
            // console.log(state) // clear state is false and mark state is true 
        }
    })
    // ---------------reset btn event handler --------------------
    resetBtn.addEventListener("click", () => {
        if(states.markState) {
            // console.log("from mark state herere");

            resetState(allConfigObj)
            states.markState = false;  
            // console.log("new state",state);

        }else if(states.clearState) {
            // console.log("from clear state");

            resetState(allConfigObj)
            states.clearState = false;
            // console.log("new state",state);

        }else {
            alert("nothing to reset!");
        }
    });

    // ------------remove template btn -----------------------
    removeTemplateBtn.addEventListener("click", () => {
        const containerToRemove = removeTemplateBtn.closest('.container');
        console.log(containerToRemove)
        containerToRemove.remove();
    })
})

// ----------------draw function------------------------
function draw({inputs, fields, states}) {
    console.log(inputs, fields, states);

    if(!inputs.maxX || !inputs.maxY || (inputs.maxX <= 0) || (inputs.maxY <= 0)) {
        alert("Invalid grid dimensions specified!");
        return;
    }

    // in grid rows and columns are flipping
    fields.gridContainer.style.display = 'grid';
    fields.gridContainer.style.gridTemplateRows = `repeat(${inputs.maxY}, minmax(10px, 50px))`;
    fields.gridContainer.style.gridTemplateColumns = `repeat(${inputs.maxX}, minmax(10px, 50px))`;
    fields.gridContainer.innerHTML = "";

    // populating with blocks 
    for(let i = inputs.maxY - 1; i >= 0; i--) { //row
        for(let j = 0; j < inputs.maxX; j++) { //column
            const block = document.createElement("div");
            block.classList.add('block');
            block.dataset.xy = `${j},${i}`;
            block.textContent = `${j},${i}`;
            fields.gridContainer.appendChild(block);
        }
    }

    fields.actionBtn.textContent = "Mark";
    fields.maxXInput.disabled = true;
    fields.maxYInput.disabled = true;

    fields.xInput.disabled = false;
    fields.yInput.disabled = false;
    fields.fillColorInput.disabled = false;

    // changing states
    states.drawState = false;
    states.markState = true;
}


// ---------------mark funciton----------------------------
function mark({inputs, fields, states}) {
    // console.log(inputs, fields, states);

    // validation of empty inputs.
    if(inputs.xToPlot === "" || inputs.yToPlot === "") {
        alert("x and y points are required for marking!");
        return;
    }

    // converting to number and proceeding, as 0 is valid in our case
    let x = Number(inputs.xToPlot);
    let y = Number(inputs.yToPlot);


    // validation of correct x and y points
    if((x >= inputs.maxX) || (y >= inputs.maxY) || (x < 0) || (y < 0)) {
        alert("x or y point does not includes in the grid generated");
        return;
    }

    // only mark if these conditions met
    if(x!== null && y!== null && (x < inputs.maxX) && (y < inputs.maxY)) {
        
        for(let i = 0; i <= y; i++) {
            const blockToColor = fields.gridContainer.querySelector(`[data-xy = "${x},${i}"]`);
            blockToColor.style.backgroundColor = `${inputs.fillColor}`;
        }
        
        fields.actionBtn.textContent = "Clear";
        fields.xInput.disabled = true;
        fields.yInput.disabled = true;
        fields.fillColorInput.disabled = true;

        // changing states
        states.markState = false;
        states.clearState = true;
    }
}

// ------------clear function--------------------
function clear({inputs, fields, states}) {
    // console.log(inputs, fields, states)

    for(let i = 0; i <= inputs.yToPlot; i++) {
        const blockToColor = fields.gridContainer.querySelector(`[data-xy = "${inputs.xToPlot},${i}"]`);
        blockToColor.style.backgroundColor = "";
    }

    fields.actionBtn.textContent = "Mark";
    fields.xInput.value = '';
    fields.yInput.value = '';
    fields.fillColorInput.value = '#000000';
    fields.xInput.disabled = false;
    fields.yInput.disabled = false;
    fields.fillColorInput.disabled = false;


    // changing states
    states.clearState = false;
    states.markState = true;
}

// ---------------reset funciton------------------
function resetState({inputs, fields, states}) {
    // console.log(inputs, fields, states);

    fields.gridContainer.innerHTML = "";
    fields.gridContainer.style.display = 'none';
    fields.actionBtn.textContent = "Draw";

    fields.maxXInput.disabled = false;
    fields.maxYInput.disabled = false;
    fields.maxXInput.value = "";
    fields.maxYInput.value = "";
            
    fields.xInput.disabled = true;
    fields.yInput.disabled = true;
    fields.fillColorInput.disabled = true;
    fields.xInput.value = "";
    fields.yInput.value = "";
    fields.fillColorInput.value = "#000000";
    states.drawState = true;
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