const foot = document.createElement('footer');
foot.className = 'footer';
foot.innerHTML = "HELLLLOOOOOOOOOOOOOOOOOOO";

document.body.append(footer);


let today = new Date();

let thisYear = today.getFullYear();


const copyright = document.createElement('p');
copyright.innerHTML = "© Matthew Shenko " + thisYear;

