
let idCount = 0;
let completedTask = new Array();

const todoSection = document.getElementById('section-todo-list');

function addChild(key) {
    // console.log(idCount)
    if(event.key == 'Enter') {
        
        //creating new root div
        let newDiv = document.createElement('div');
        newDiv.setAttribute("class", "item-list md-checkbox");
        newDiv.setAttribute("id", `row${++idCount}`);
        newDiv.setAttribute("draggable", 'true');
        newDiv.setAttribute("onmousedown", 'dragItems()');

        newDiv.innerHTML = `
            <div> <input type="checkbox" id="checkbox${idCount}" onclick="changeState('row${idCount}')"><label for="checkbox${idCount}">${key.value}</label></div> 
            <div class="item-move" onclick="removeTask('row${idCount}')"> <i class="icon-close">&times;</i></div> 
        `;

        todoSection.appendChild(newDiv);                
        updateTaskStatus();
        document.getElementById(key.id).value = "";
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

function changeState(divId) {
    
    const div = document.getElementById(`${divId}`);            
    const checkedStatus = div.getElementsByTagName('input')[0].checked;

    if(checkedStatus) {
        div.getElementsByTagName('label')[0].style.textDecoration = 'line-through';
    } else {
        div.getElementsByTagName('label')[0].style.textDecoration = 'none';
    }
    updateTaskStatus(divId);
}

function removeTask(divId) {
    if(!completedTask.includes(divId)) {
        if(window.confirm("Task yet not be completed.\nAre you sure want to delete")) {
            removeDiv(divId);
        }
    } else {
        removeDiv(divId);
    }
    
}

function removeDiv(divId) {
    document.getElementById(divId).remove();
    --idCount;
    // updateTaskStatus(divId);
    if(completedTask.includes(divId)) {
        const index = completedTask.indexOf(divId);
        completedTask.splice(index, 1);
    }
    if(idCount == 0)
        document.getElementById('taskStatus').innerHTML = "";
    else 
        document.getElementById('taskStatus').innerHTML = "Task : "+ completedTask.length  + "/" + idCount;
}

function updateTaskStatus(args) {
    if(args == null) {
        document.getElementById('taskStatus').innerHTML = "Task : "+ completedTask.length  + "/" + idCount;
    } else {
        if(completedTask.includes(args)) {
            const index = completedTask.indexOf(args);
            completedTask.splice(index, 1);
            console.log("after splice : " + completedTask);
        } else {
            completedTask[completedTask.length] = args;
        }

        document.getElementById('taskStatus').innerHTML = "Task : "+ completedTask.length  + "/" + idCount;
    }
}


// drag item

let dragItem = null;
var dragSrcEl = null;

function handleDragStart(e) {
    // Target (this) element is the source node.
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);

    this.classList.add('dragElem');

}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    this.classList.add('over');

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
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
        this.parentNode.removeChild(dragSrcEl);
        var dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin',dropHTML);
        var dropElem = this.previousSibling;
        addDnDHandlers(dropElem);
        
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
    updateCheckMark();
}

let divElem;

function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragenter', handleDragEnter, false)
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);
    divElem = elem;
}

function dragItems() {
    var cols = document.querySelectorAll('#section-todo-list .item-list');
    [].forEach.call(cols, addDnDHandlers);
}

function updateCheckMark() {
    const rowId = divElem.id;
    if(completedTask.includes(rowId)) {
        // console.log(completedTask)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        // let divelem;
        let checkboxID = divElem.getElementsByTagName('div')[0].getElementsByTagName('input')[0].id;
        document.getElementById(checkboxID).checked = true;  
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    console.log(JSON.stringify(completedTask));
    // localStorage.setItem('items', JSON.stringify(completedTask));
    // const data = JSON.parse(localStorage.getItem('items'));
}

function createJson(){
    console.log(todoSection);
    
    var taskArray = {};

$("input[class=email]").each(function() {
  var id = $(this).attr("title");
  var email = $(this).val();

  //how to create JSON?

});
}