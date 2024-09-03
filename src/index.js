// ---------- tab ---------

let tablinks = document.querySelectorAll('.tablinks');
let tabContent = document.querySelectorAll('.main__section');

tablinks.forEach(element => {
    element.addEventListener('click', openTab)
});

function openTab(event) {
    for (const item of tablinks) {
        item.classList.remove('tablinks-active');
    }

    event.currentTarget.classList.add('tablinks-active');

    for (const item of tabContent) {
        item.classList.remove('active');
    }

    const tabName = event.currentTarget.getAttribute('data-target');
    document.getElementById(tabName).classList.add('active');
}

