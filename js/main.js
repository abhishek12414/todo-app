let idCount = 0;
let completedTask = new Array();

const todoSection = document.getElementById('section-todo-list');

function addChild(key) {
    if(event.key == 'Enter' && key.value != "") {
        
        //creating new root div
        let newDiv = document.createElement( 'div' );
        newDiv.setAttribute( "class", "item-list md-checkbox" );
        newDiv.setAttribute( "id", `row${++idCount}` );
        newDiv.setAttribute( "draggable", 'true' );
        newDiv.setAttribute( "onmousedown", 'dragItems()' );

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

    if(checkedStatus)
        div.getElementsByTagName('label')[0].style.textDecoration = 'line-through';
    else
        div.getElementsByTagName('label')[0].style.textDecoration = 'none';

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
let dragSrcEl = null;

function handleDragStart(e) {
    // Target (this) element is the source node.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragElem');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    this.classList.add('over');

    e.dataTransfer.dropEffect = 'move';

    return false;
}

function handleDragEnter(e) {}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl != this) {
        this.parentNode.removeChild(dragSrcEl);
        let dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin',dropHTML);
        let dropElem = this.previousSibling;
        addDnDHandlers(dropElem);        
    }
    this.classList.remove('over');
    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    this.classList.remove('over');
    updateCheckMark();
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
    let cols = document.querySelectorAll('#section-todo-list .item-list');
    [].forEach.call(cols, addDnDHandlers);
}
