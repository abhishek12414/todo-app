let jsonData = {};
let jsonLength = 0;
let completedTask = 0;

// drag operations
var dragSrcEl = null;
let dragSrcId, dragDropId;

function storeData() {
    localStorage.clear();
    localStorage.setItem('todo', JSON.stringify(jsonData));

    // $(function(){
        console.log(jsonData['element'])
        $.ajax({
            type: 'GET',
            url: '/data',
            crossDomain:true, 
            dataType: "json",
            data:  {data: jsonData['element']},
            success: function(resultData) {
                console.log(resultData);
            }
        });
    // });

}

$('#inputRecord').keypress(function(e) {
    if(e.which == 13) {
        if($(this).val() != "") {
            createJson($(this).val());
            $(this).val("");
        }
    } 
});

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
    jsonLength = jsonData['element'].length;
    completedTask = 0;
    if(jsonData != null)
        storeData();

    $('#section-todo-list').text("");
    if(jsonData == null || jsonData['element'].length == 0) {
        $('#taskStatus').text("");
        $('.fa-trash').hide();
        $('.operations').hide();
        return;
    } else {
        $('.fa-trash').show();
        $('.operations').show();
    }
    
    for(let i=0; i<jsonData['element'].length; i++) {
        jsonData['element'][i]['id'] = i;
        let id = jsonData['element'][i]['id'];
        let text = jsonData['element'][i]['text'];
        let checkedStatus = jsonData['element'][i]['isChecked'];

        var childDiv = $('<div></div>');
            $(childDiv).attr("class", "item-list md-checkbox");
            $(childDiv).attr("id", `row${id}`);
            $(childDiv).attr("draggable", 'true');
            $(childDiv).attr("onmousedown", 'dragItems()');

            var childContent = `
                <div class="todo-item">
                    <input type="checkbox" id="checkbox${id}" onchange="changeState('row${id}')" ${(checkedStatus)?"checked":""}/>
                    <label id="label${id}" class="labelTodo" contenteditable="true">${text}</label>
                </div> 
                <div class="item-move" onclick="removeTask('label${id}')">
                    <i class="icon-close">&times;</i>
                </div> 
            `;
            
            $(childDiv).append(childContent);

            $('#section-todo-list').append(childDiv);

            if(`${checkedStatus}` == 1)
                completedTask++;

            updateTextDecoration(`label${id}`, `${checkedStatus}`)
    }

    if(completedTask == jsonLength)
        $('.operations input:checkbox').prop('checked', true);

    $('#taskStatus').text("Task : "+ completedTask  + "/" + jsonData['element'].length);   
}

function updateTextDecoration(labelId, checkedStatus) {
    if(checkedStatus == 1) {
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

function changeState(divId) {
    const changeId = parseInt(divId.charAt(divId.length-1));
    const newArray = jsonData['element'].concat();
    newArray[changeId].isChecked = (newArray[changeId].isChecked == 0) ? 1 : 0    
    displayData();
}

function removeTask(divId) {
    const removeId = parseInt(divId.charAt(divId.length-1));
    const newArray = jsonData['element'].concat();
    const checkedState = jsonData['element'][removeId]['isChecked'];

    if(checkedState == 0) {
        if(window.confirm("Task yet not be completed.\nAre you sure want to delete"))
            removeDiv(divId);        
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
    if(window.confirm('Are you sure want to delete all tasks?')) {
        jsonData['element'] = [];
        localStorage.clear();
        displayData();
    }
}

$('.operations input[type=checkbox]').change(function() {
    var ischecked= $(this).is(':checked');
    if(ischecked)
        updateMark(1)
    else
        updateMark(0);
});

function updateMark(value) {
    for(let i=0; i<jsonData['element'].length; i++) {
        jsonData['element'][i]['isChecked'] = value;
    }
    displayData();
}

//todo edit
$('.todo-item').on('keydown', '.labelTodo', function(e) {
    if(e.key == 'Enter') {
        let labelId = this.id;
        let labelIndex = labelId.slice(labelId.length-1);
        let value = e.target.textContent;
        jsonData['element'][labelIndex]['text'] = value;
        displayData();
    }
});

$('.labelTodo').focus(function(){
    $('#'+this.id).css('border-bottom', '3px solid #fff')
});

function handleDragStart(e) {
    // Target (this) element is the source node.
    dragSrcEl = this;
    dragSrcId = this.id;
}

function handleDragOver(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.
}

function handleDragEnter(e) {
    // this / e.target is the current hover target.
}

function handleDragLeave(e) {
    // this / e.target is previous target element.
}

function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragDropId = this.id;
        changePriority();        
    }

    this.classList.remove('over');
    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
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
    var cols = $('#section-todo-list .item-list');
    [].forEach.call(cols, addDnDHandlers);
}

//run on load
if(localStorage.getItem('todo') == null) {
    jsonData['element'] = [];
} else {
    jsonData = JSON.parse(localStorage.getItem('todo'));
    if(jsonData != null)
        displayData();
}
