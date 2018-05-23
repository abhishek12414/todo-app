let jsonData = {};

if(localStorage.getItem('todo') == null) {
    console.log('called else')
    jsonData['element'] = [];
} else {    
    console.log('called if')
    jsonData = JSON.parse(localStorage.getItem('todo'));
    if(jsonData != null)
        displayData();
}

function storeData() {
    localStorage.clear();
    localStorage.setItem('todo', JSON.stringify(jsonData));
}

function addChild(key) {
    // console.log(idCount)
    if(event.key == 'Enter') {
        //creating new root div
        if(key.value != "") {
            createJson(key.value);
            document.getElementById(key.id).value = "";
        }
    }
}     

function createJson(value){
    
    let element = {
        'id': jsonData['element'].length,
        'text': value, 
        'isChecked': 0
    };
    jsonData['element'].push(element);
    displayData();
}


function displayData() {
    if(jsonData != null)
        storeData();

    let todoSection = document.getElementById('section-todo-list');
    todoSection.innerHTML = "";

    if(jsonData == null) {
        document.getElementById('taskStatus').innerHTML = "";
        return;
    }

    

    let completedTask = 0;
    
    for(let i=0; i<jsonData['element'].length; i++) {
        // console.log(textObject);
        jsonData['element'][i]['id'] = i;
        // console.log('alksjdflkj'+jsonData['element'])
        let id = jsonData['element'][i]['id'];
        let text = jsonData['element'][i]['text'];
        let checkedStatus = jsonData['element'][i]['isChecked'];

        let newDiv = document.createElement('div');
            newDiv.setAttribute("class", "item-list md-checkbox");
            newDiv.setAttribute("id", `row${id}`);
            newDiv.setAttribute("draggable", 'true');
            newDiv.setAttribute("onmousedown", 'dragItems()');

            // newDiv.setAttribute('ondrop','drop(event)');
            // newDiv.setAttribute('ondragover','allowDrop(event)');
            // newDiv.setAttribute("ondragstart", "drag(event)")

            newDiv.innerHTML = `
                <div> 
                    <input type="checkbox" id="checkbox${id}" onchange="changeState('row${id}')" ${(checkedStatus)?"checked":""}>
                    <label for="checkbox${id}" id="label${id}">${text}</label>
                </div> 
                <div class="item-move" onclick="removeTask('label${id}')">
                    <i class="icon-close">&times;</i>
                </div> 
            `;

            todoSection.appendChild(newDiv);
            if(`${checkedStatus}` == 1)
                completedTask++;

            updateTextDecoration(`label${id}`, `${checkedStatus}`)
            // console.log("in display : " + `${checkedStatus}`)
            // updateTaskStatus();
            // document.getElementById(id).value = "";
    }

    if(jsonData['element'].length == 0)
        document.getElementById('taskStatus').innerHTML = "";
    else
        document.getElementById('taskStatus').innerHTML = "Task : "+ completedTask  + "/" + jsonData['element'].length;   

}

function updateTextDecoration(labelId, checkedStatus) {
    // console.log(labelId + " status " + checkedStatus)
    if(checkedStatus == 1) {
        document.getElementById(labelId).style.textDecoration = 'line-through';
    } else {
        document.getElementById(labelId).style.textDecoration = 'none';
    }
}

function changeState(divId) {
    const changeId = parseInt(divId.charAt(divId.length-1));
    const newArray = jsonData['element'].concat();
    newArray[changeId].isChecked = (newArray[changeId].isChecked == 0) ? 1 : 0  
    displayData();
}

function removeTask(divId) {
    const removeId = parseInt(divId.charAt(divId.length-1));
    // console.log("remove id : "+removeId)

    const newArray = jsonData['element'].concat();
    
    const checkedState = jsonData['element'][removeId]['isChecked'];


    if(checkedState == 0) {
        if(window.confirm("Task yet not be completed.\nAre you sure want to delete")) {
            removeDiv(divId);
        }
    } else {
        removeDiv(divId);
    }    
}

function removeDiv(divId) {
    const removeId = parseInt(divId.charAt(divId.length-1));

    const newArray = jsonData['element'].concat();

    const temparrright = newArray.splice(removeId+1, newArray.length);
    const temparrleft = newArray.splice(0, removeId);
    
    jsonData['element'] = temparrleft.concat(temparrright);

    displayData();
}

function changePriority() {

    // console.log('start : ' + dragSrcId)
    // console.log('drop : ' + dragDropId)

    const fromIndex = parseInt(dragSrcId.charAt(dragSrcId.length-1));
    const toIndex = parseInt(dragDropId.charAt(dragDropId.length-1));

    let arr = jsonData['element'].concat();
    const length = arr.length;

    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    jsonData['element'] = arr;

    displayData();
}


// clear all records
function clearRecord() {
    jsonData['element'] = [];
    localStorage.clear();
    displayData();
}

function markAll() {
    for(let i=0; i<jsonData['element'].length; i++)
        jsonData['element'][i]['isChecked'] = 1;
    
    displayData();
}


function unMarkAll() {
    for(let i=0; i<jsonData['element'].length; i++) {
        jsonData['element'][i]['isChecked'] = 0;
    }
    displayData();
}








// drag operations

let dragItem = null;
var dragSrcEl = null;

let dragSrcId, dragDropId;

function handleDragStart(e) {
    // Target (this) element is the source node.
    dragSrcEl = this;
    dragSrcId = this.id;
    // e.dataTransfer.effectAllowed = 'move';
    // e.dataTransfer.setData('text/html', this.outerHTML);
    // this.classList.add('dragElem');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    // this.classList.add('over');
    // e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    // return false;
}

function handleDragEnter(e) {
// this / e.target is the current hover target.
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        //alert(this.outerHTML);
        //dragSrcEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
        dragDropId = this.id;
        changePriority();
        // this.parentNode.removeChild(dragSrcEl);
        // var dropHTML = e.dataTransfer.getData('text/html');
        // this.insertAdjacentHTML('beforebegin',dropHTML);
        // var dropElem = this.previousSibling;
        // // var dropElem = this.parentNode;
        // addDnDHandlers(dropElem);
        
    }
    this.classList.remove('over');
    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    this.classList.remove('over');
    /*[].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });*/

}

function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragenter', handleDragEnter, false)
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);
}

function dragItems() {
    var cols = document.querySelectorAll('#section-todo-list .item-list');
    // `console.log`(cols);
    [].forEach.call(cols, addDnDHandlers);
}
