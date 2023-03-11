
const onFormSubmit = (evt) => {
    evt.preventDefault();
    let form = document.forms.mainForm;
    const note = { name: form.name.value,
                    description: form.description.value,
                    startDate: form.startDate.value,
                    endDate: form.endDate.value,
                    isCompleted: false};
    let toDoList = localStorage.getItem('toDoList');
    let id;
    if (toDoList == null) {
        toDoList = [];
        id = 0;
    }
    else {
        toDoList = JSON.parse(toDoList);
        if (toDoList.length > 0)
            id = toDoList.reduce( (acc,it) => { return (it.id > acc) ? it.id : acc },0) + 1;
        else
            id = 0;
    }
    note.id = id;
    toDoList.push(note);
    localStorage.setItem('toDoList',JSON.stringify(toDoList))
    open('tasks.html','_self')
}

document.forms.mainForm.addEventListener('submit',onFormSubmit);
