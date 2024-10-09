// footer section

const foot = document.createElement('footer');
foot.className = 'footer';
document.body.append(foot);


// Date and Year Information


let today = new Date();
let thisYear = today.getFullYear();


//copyright section, which uses the Date/Year and appends to the footer


const copyright = document.createElement('p');
copyright.innerHTML = "© Matthew Shenko " + thisYear;

foot.appendChild(copyright);


//new skills section and list, function that creates a bulleted list


const skillz = ["Oxygen consumption", "Levitation (underwater only)", "Carbon production", "Encyclopedic knowledge of Yes lyrics", "Three tacos in a single sitting", "Usually a pretty nice guy"];
const skillsSection = document.querySelector("#skills-2");
const skillsList = skillsSection.querySelector("ul");

for (let i = 0; i < skillz.length; i++) {
    let skill = document.createElement('li');
    skill.innerHTML = skillz[i];
    skillsList.appendChild(skill);
};


//getting info from GitHub via Fetch and sticking it in the elements


fetch("https://api.github.com/users/shenkoshenkoshenko/repos")
    .then((response) => {
        if (response.ok) {
            return response.text();
        } else {
        throw new Error("Whoops!  We've got an error!");
        }
    })
    .then((data) => {
        const repositories = JSON.parse(data);
        //console.log(repositories);

        const projectSection = document.getElementById("projects-box");
        let projectList = projectSection.querySelector("ul");
        projectSection.appendChild(projectList);

        for(let repository of repositories) {
            let project = document.createElement("li");
            project.innerHTML = `<a class="proj-link" href="${repository.html_url}">${repository.name}</a>`;
            projectList.appendChild(project);
        }
    })
    .catch((error) => {
        console.error("Try again later...", error.message)
    });


//message section


let messageForm = document.querySelector("[name='haiku']");
let messageSection = document.getElementById("message-section");
let messageList = messageSection.querySelector("ul");
messageSection.hidden = true;


//Tom's id Counter


let idCounter = 0;

function makeID() {
    return 'entry' + idCounter++;
}

let entryByID = {};


//submit button + Tom's edit/remove buttons


messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let name = event.target.usersName.value;
    let email = event.target.usersEmail.value;
    let message = event.target.usersMessage.value;

    let uid = makeID();
    let newMessage = document.createElement('li');
    newMessage.classList.add('message-item');
    newMessage.innerHTML = `<a href="mailto:${email}">${name}</a><span> wrote: <br> ${  message  }<br></span>`;
    newMessage.setAttribute('id', uid);

    entryByID[uid] = { usersName: name, usersEmail: email, usersMessage: message };
    newMessage.appendChild(makeEditButton());
    newMessage.appendChild(makeRemoveButton());

    messageList.appendChild(newMessage);
    messageForm.reset();
    messageSection.hidden = false;
});



//Tom's remove button

function makeRemoveButton() {
    let removeButton = document.createElement('button');
    removeButton.innerText = 'whoops';
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {
        let entry = removeButton.parentNode;
        let uid1 = entry.getAttribute('id');
        delete entryByID[uid1];
        entry.remove();
        if (messageList.childElementCount === 0) {
            messageSection.hidden = true;
        }
    });
    return removeButton;
}


//Tom's edit button


function makeEditButton() {
    let editButton = document.createElement('button');
    editButton.innerText = 'edit';
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => {
        let entry = editButton.parentNode;
        let oldEditButton = entry.querySelector('button.edit-button');
        oldEditButton.hidden = true;
        let uid = entry.getAttribute('id');
        let clonedForm = messageForm.cloneNode(true);
        clonedForm.className = "edit-message-form";
        clonedForm.usersName.value = entryByID[uid].usersName;
        clonedForm.usersEmail.value = entryByID[uid].usersEmail;
        clonedForm.usersMessage.value = entryByID[uid].usersMessage;
        entry.appendChild(clonedForm);
        clonedForm.addEventListener('submit', function editMessage(event) {
            event.preventDefault();
            entryByID[uid].usersName = event.target.usersName.value;
            entryByID[uid].usersEmail = event.target.usersEmail.value;
            entryByID[uid].usersMessage = event.target.usersMessage.value;
            let newEntry = document.createElement('li');
            newEntry.classList.add('message-item');
            newEntry.setAttribute('id', uid);
            newEntry.innerHTML = `<a href="mailto:${entryByID[uid].usersEmail}">${entryByID[uid].usersName}</a><span> wrote:<br> ${entryByID[uid].usersMessage}</span>  `;
            newEntry.appendChild(makeEditButton());
            newEntry.appendChild(makeRemoveButton());
            entry.parentNode.replaceChild(newEntry, entry);
        });
    });
    return editButton;
}
