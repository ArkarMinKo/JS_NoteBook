window.onload = ()=>{
    // -------------------- Date & Day ------------
    function AddtoDate() {
        var currentdate = new Date();

        var year = currentdate.getFullYear();
        var month = currentdate.getMonth();
        var date = currentdate.getDate();
        var day = currentdate.getDay();

        var months = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
        month = months[month];

        date = (date < 10) ? '0' + date : date;

        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        day = days[day];

        var appenddate = document.getElementById('date');
        var appendday = document.getElementById('day');

        appenddate.innerHTML = date + ' ' + month + ' ' + year;
        appendday.innerHTML = day;

        setTimeout(AddtoDate,1000);
    }
    AddtoDate();

    // --------------------Time------------------

    function AddtoTime(){
        var currenttime = new Date();
        var hour = currenttime.getHours();
        var minute = currenttime.getMinutes();
        var second = currenttime.getSeconds();
        var session = "AM";

        if(hour == 12){
            hour = 0;
        }
        
        if(hour > 12){
            hour -= 12;
            session = "PM";
        }

        hour = (hour < 10) ? '0' + hour : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        second = (second < 10) ? '0' + second : second;

        var appendtime = document.getElementById('time');
        
        appendtime.innerHTML = hour + ' : ' + minute + ' : ' + second + ' ' + session;
        setTimeout(AddtoTime,1000);
    }
    AddtoTime()
}
// --------------------AddtoNote-----------------------------

//--------------variable of seclector------------------------

const ullist = document.getElementById('list');
const addednote = document.getElementById('addednote');
const clearall = document.getElementById('clearall');

//--------------Class Variable For Icon when checked or unchecked change icon----------

const Check = "fa-circle-check";
const Uncheck = "fa-circle";

//--------------Created Json Object as database using with localstorage--------------

let LIST,id;

// get item from localstorage and will be string format
let data = localStorage.getItem('ToNote');

//check if data is empty or not
if(data){// data get
    LIST = JSON.parse(data); // convert JSON datatype
    id = LIST.length; // set the id to last one in the list becacuse length means fequency of the list item
}
else{
    LIST= [];// nothing data; noting list
    id = 0;//nothing in list
};

//-------------------------------Load items to the UI-----------------------

function loadList(array){
    // looping output foreach item(object) to array that called function
    array.forEach(item => {
        AddtoNote(item.name,item.id,item.notedate,item.done,item.trash)
    });
};

//-------------------------------ClearAll----------------------------

clearall.addEventListener('click',function(){
    localStorage.clear();//Clearall in localstorage
    location.reload();//Reload pages
});

//-----------------------AddtoNote function-----------------------

function AddtoNote(note,id,notedate,done,trash){
    if(trash){
        return;
    }

    const Done = done ? Check : Uncheck;
    
    const item = `
        <li>
            <i class="fa-regular ${Done}" id="${id}" job="complete"></i>
            <p id="content">${note}</p>
            <span class="notedate" id="notedate">${notedate}</span>
            <i class="fa-solid fa-trash" id="${id}" job="delete"></i>
        </li>
    `;

    ullist.insertAdjacentHTML("beforeend",item);
};
//---------------------------------------------------Clear Value-------------------------------------
function CancelValue(){
    addednote.value = "";
};
//-------------------Add an item to the list when the user press the Enter Key and Plus Button------------
function AddtoValue(){
    const Note = addednote.value;
    const Notedate = document.getElementById('date').innerHTML;
    //if the input isn't empty
    if(Note){
        AddtoNote(Note,id,Notedate,false,false);

        LIST.push({
            name: Note,
            id: id,
            notedate: Notedate,
            done: false,
            trash: false
        });
        
        // add item to localstorage
        // List need to update everytime whenever new data inserted
        localStorage.setItem('ToNote', JSON.stringify(LIST));
        id++;
    }
    CancelValue();
}
document.addEventListener('keyup', function(event){
    if(event.keyCode == 13){
        const Note = addednote.value;
        const Notedate = document.getElementById('date').innerHTML;
        //if the input isn't empty
        if(Note){
            AddtoNote(Note,id,Notedate,false,false);

            LIST.push({
                name: Note,
                id: id,
                notedate: Notedate,
                done: false,
                trash: false
            });
            
            // add item to localstorage
            // List need to update everytime whenever new data inserted
            localStorage.setItem('ToNote', JSON.stringify(LIST));
            id++;
        }
        CancelValue();
    }
});

//-------------------------If read, show correct---------

function completeToNote(element){
    element.classList.toggle(Check);
    element.classList.toggle(Uncheck);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//-----------------------Remove to Note----------------

function removeToNote(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

//----------------------------target the items created dynamically----------------

ullist.addEventListener('click',(event)=>{
    const element = event.target;
    
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){
        completeToNote(element);
    }
    else{
        removeToNote(element);
    }

    // add item to localstorage
    localStorage.setItem("ToNote",JSON.stringify(LIST));
})