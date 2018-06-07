let jsonData = [];
let completedTask = 0;

// drag operations
let dragSrcEl = null;
let dragSrcId, dragDropId;

function storeData() {
    $.ajax({
        type: 'POST',
        url: '/api',
        crossDomain: true,
        data: {data: JSON.stringify(jsonData)},
        success: function (resultData) {
            jsonData = resultData;
            displayData();
        }
    });
}

// create json object with value
function createJson(value) {
    let element = {
        'id': jsonData.length,
        'text': value,
        'isChecked': 0
    };
    jsonData.push(element);
    storeData();
}

function displayData() {
    completedTask = 0;
    let i = 0;

    $('#section-todo-list').text("");

    if (jsonData.length === 0) {
        $('#taskStatus').text("");
        $('.fa-trash, .operations').hide();
        return;
    } else {
        $('.fa-trash, .operations').show();
    }

    jsonData.forEach((todos)=>{
        let id = i++;
        let text = todos.text;
        let checkedStatus = todos.isChecked;

        let childDiv = $('<div>');

        $(childDiv).attr({
            class: "item-list md-checkbox",
            id: `row${id}`,
            draggable: 'true',
            onmousedown: 'dragItems()'
        });

        let childContent = `
            <div class="todo-item">
                <input type="checkbox" id="checkbox${id}" onchange="changeCheckedState('row${id}')" ${(checkedStatus)?"checked":""}/>
                <label id="label${id}" class="labelTodo" contenteditable="true">${text}</label>
            </div> 
            <div class="item-delete" onclick="removeTask('label${id}')">
                <i class="icon-close">&times;</i>
            </div>`;
        
        $(childDiv).append(childContent);
        $('#section-todo-list').append(childDiv);
        if(`${checkedStatus}` == 1)
            completedTask++;
        updateTextDecoration(`label${id}`, `${checkedStatus}`);
    });

    $('.operations input:checkbox').prop('checked', (completedTask == jsonData.length) ? true : false);
    $('#taskStatus').text("Task : " + completedTask + "/" + jsonData.length);
}

function updateTextDecoration(labelId, checkedStatus) {
    if (checkedStatus == 1) {
        $('#' + labelId).css({
            transition: '4s',
            textDecoration: 'line-through',
            color: '#b99393'
        });
    } else {
        $('#' + labelId).css({
            transition: '4s',
            textDecoration: 'none'
        });
    }
}

function changeCheckedState(divId) {
    const changeId = parseInt(divId.charAt(divId.length - 1));
    const newArray = jsonData.concat();
    newArray[changeId].isChecked = (newArray[changeId].isChecked == 0) ? 1 : 0
    storeData();
}

function removeTask(divId) {
    const removeId = parseInt(divId.substring('label'.length));
    const newArray = jsonData.concat();
    const checkedState = $(`#checkbox${removeId}`).is(':checked');

    if (!checkedState) {
        if (window.confirm("Task yet not be completed.\nAre you sure want to delete"))
            removeDiv(divId);
    } else {
        removeDiv(divId);
    }
}

function removeDiv(divId) {

    const removeId = parseInt(divId.substring('label'.length));
    const newArray = jsonData.concat();

    const temparrright = newArray.splice(removeId + 1, newArray.length);
    const temparrleft = newArray.splice(0, removeId);

    jsonData = temparrleft.concat(temparrright);
    storeData();
}

function changePriority() {
    const fromIndex = parseInt(dragSrcId.slice(3, dragSrcId.length));
    const toIndex = parseInt(dragDropId.slice(3, dragSrcId.length));

    let arr = jsonData.concat();

    const length = arr.length;
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    jsonData = arr;

    storeData();
}

// clear all records
function clearRecord() {
    if (window.confirm('Are you sure want to delete all tasks?')) {
        jsonData = [];

        $.ajax({
            type: 'DELETE',
            url: '/api',
            crossDomain: true,
            success: function (resultData) {
                displayData();
            }
        });
    }
}   

function updateMark(value) {
    for (let i = 0; i < jsonData.length; i++) {
        jsonData[i]['isChecked'] = value;
    }
    storeData();
}

// Drag drop operation
function handleDragStart(e) {
    // Target (this) element is the source node.
    dragSrcEl = this;
    dragSrcId = this.id;
}

function handleDragOver(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.
}

function handleDragEnter(e) {}

function handleDragLeave(e) {}

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    if (dragSrcEl != this) {
        dragDropId = this.id;
        changePriority();
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('over');
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
    let cols = $('#section-todo-list .item-list');
    [].forEach.call(cols, addDnDHandlers);
}


// add a new todo task
$('#inputRecord').keypress(function (e) {
    if (e.which == 13) {
        if ($(this).val() != "") {
            createJson($(this).val());
            $(this).val("");
        }
    }
});

$('.operations input[type=checkbox]').change(function() {
    let ischecked= $(this).is(':checked');
    if(ischecked)
        updateMark(1)
    else
        updateMark(0);
});

//todo edit
$('#section-todo-list').on('keydown', '.todo-item .labelTodo', function (e) {
    if (e.key == 'Enter') {
        let labelId = this.id;
        let labelIndex = labelId.slice(labelId.length - 1);
        let value = e.target.textContent;
        jsonData[labelIndex]['text'] = value;
        storeData();
    }
});

// Custom css on focus while adding a todo item
$('.labelTodo').focus(function () {
    $('#' + this.id).css('border-bottom', '3px solid #fff')
});

//on body load
$(function () {
    $.ajax({
        type: 'GET',
        url: '/api',
        crossDomain: true,
        success: function (resultData) {
            if(resultData){
                jsonData =resultData;
                displayData();
            }
        }
    });
});