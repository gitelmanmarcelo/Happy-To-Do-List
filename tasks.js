const calcDays = (date_ini,dueDate) => {
    const today = new Date();
    const date_iniObj = new Date(date_ini);

    const dateToSubtract = new Date(dueDate);
    let differenceInMilliseconds;
    if (date_iniObj > today)
        differenceInMilliseconds = dateToSubtract.getTime() - date_iniObj.getTime();
    else
        differenceInMilliseconds = dateToSubtract.getTime() - today.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));
    return differenceInDays+1; 
}


const showDropdown = (evt) => {
    evt.target.querySelector('.dropdown').style.display = 'block';
}

const hideDropdown = (evt) => {
    evt.target.querySelector('.dropdown').style.display = 'none';
}

const setDivColor = (div, isCompleted, endDate) => {
    if (isCompleted) {
        div.classList.add('completedTask');
        div.classList.remove('notCompletedTask','expiredTask');
    }
    else {
        if (new Date(endDate) >= new Date())  {
            div.classList.add('notCompletedTask');
            div.classList.remove('completedTask','expiredTask');
        }
        else
            {
                div.classList.add('expiredTask');
                div.classList.remove('notCompletedTask','completedTask');
            }
    }
}

const onChangeStatus = (evt,id,endDate) => {
    const row_div = evt.currentTarget.parentElement;
    const changed_note = toDoList.find(el => el.id === id);
    setDivColor(row_div, evt.target.checked, endDate);
    if (evt.target.checked){
        changed_note.isCompleted = true;
    }
    else {
        changed_note.isCompleted = false;
        }
    localStorage.setItem('toDoList',JSON.stringify(toDoList));
}

const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

const onEditClick = (evt,note_id,name,description,startDate,endDate) => {
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
    const edit = document.querySelector('#editForm');
    edit.name.value = name;
    edit.description.value = description;
    edit.startDate.value =startDate;
    edit.endDate.value = endDate;
    document.querySelector('#confirmChanges').addEventListener('click',() => {confirmEditChanges(evt.target.parentElement,note_id)});
}

const confirmEditChanges = (div, note_id) => {
    const edit = document.querySelector('#editForm');
    toDoList.forEach( (el,index) => {
        if (el.id === note_id) {
            toDoList[index].name = edit.name.value;
            toDoList[index].description = edit.description.value;
            toDoList[index].startDate = edit.startDate.value;
            toDoList[index].endDate = edit.endDate.value;
        }
    });
    localStorage.setItem('toDoList',JSON.stringify(toDoList));
    div.querySelector(':nth-child(1)').textContent = edit.name.value;
    div.querySelector(':nth-child(2)').textContent = edit.name.startDate;
    div.querySelector(':nth-child(3)').textContent = calcDays(startDate,endDate);
}


const onTrashClick = (evt,id) => {
    if (!confirm('Are you sure you want to delete this task ?'))
        return;
    toDoList = toDoList.filter(el => el.id !== id);
    localStorage.setItem('toDoList',JSON.stringify(toDoList));
    document.querySelector('#tasksList').removeChild(evt.currentTarget.parentElement.parentElement);    
}

const addField = (rowDiv, field) => {
    const p = document.createElement('p');        
    const txt = document.createTextNode(field);
    p.appendChild(txt);
    rowDiv.appendChild(p);    
} 

const addCheckboxField = (rowDiv,field,id,endDate) => {
    const cb = document.createElement('input');        
    cb.type='checkbox';
    cb.id = 'cb' + id.toString();
    const lbl = document.createElement('label');
    lbl.for = 'cb' + id.toString();
    lbl.textContent = 'Check:';
    cb.addEventListener('change', (evt) => onChangeStatus(evt,id,endDate));
    if (field)
        cb.checked = true;
    rowDiv.appendChild(lbl);    
    rowDiv.appendChild(cb);    
} 

const AddEditIcon = (rowDiv,note_id,name,description,startDate,endDate) => {
    const div = document.createElement('div');
    div.classList.add('cell','trash');
    const i = document.createElement('i');        
    i.classList.add('fa-solid','fa-pencil');
    div.appendChild(i);    
    rowDiv.appendChild(div);
    div.addEventListener('click',(evt) => onEditClick(evt,note_id,name,description,startDate,endDate));    
} 

const AddTrashIcon = (rowDiv,note_id) => {
    const div = document.createElement('div');
    div.classList.add('cell','trash');
    const i = document.createElement('i');        
    i.classList.add('fa-regular','fa-trash-can');
    div.appendChild(i);    
    rowDiv.appendChild(div);
    div.addEventListener('click',(evt) => onTrashClick(evt,note_id));    
} 


let toDoList = localStorage.getItem('toDoList');
toDoList = JSON.parse(toDoList);
toDoList = toDoList.sort((a,b) => new Date(a.startDate) - new Date(b.startDate));

toDoList.forEach(el => {
    // assign variables
    const {id: note_id, name , description, startDate, endDate, isCompleted} = el;
    // create div for the note "row"
    const div=document.createElement('div');
    div.classList.add('taskRow');
    // add name field
    addField(div,name);
    // add start date field
    const d = new Date(startDate);
    addField(div,d.toUTCString().slice(5,22));
    // add days left
    const days = calcDays(startDate,endDate) || 0; 
    if (days ===  '1')
        addField(div,days + ' day left');
    else
        addField(div,days + ' days left');
    // add checkbox
    addCheckboxField(div,isCompleted,note_id,endDate); 
    // set the color according to status
    setDivColor(div, isCompleted, endDate);
    // create a div to organize the buttons
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('btnDiv');
    AddEditIcon(btnDiv,note_id,name,description,startDate,endDate);
    AddTrashIcon(btnDiv,note_id);
    div.appendChild(btnDiv);
    // edit note dropdown
    div.addEventListener('mouseenter',showDropdown);
    div.addEventListener('mouseleave',hideDropdown);
    const droptext = document.createTextNode(description);
    const dropdown = document.createElement('div');
    dropdown.appendChild(droptext);
    dropdown.classList.add('dropdown');
    div.appendChild(dropdown);
    div.style.position = 'relative';
    // append the note to the DOM
    document.querySelector('#tasksList').appendChild(div)
});

document.querySelector('#cancelChanges').addEventListener('click',() => {closeModal()});


