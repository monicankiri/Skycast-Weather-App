console.log("Skycast is starting");

console.log(document.title);

const navigationButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");

navigationButtons.forEach(function (button) {
button.addEventListener("click", function () {
const targetScreenId = button.dataset.screen;

    screens.forEach(function (screen) {
        screen.hidden = screen.id !== targetScreenId;
        screen.classList.toggle("active", screen.id === targetScreenId);
    });

    navigationButtons.forEach(function (navButton) {
        navButton.classList.remove("active");
        navButton.removeAttribute("aria-current");
    });

    button.classList.add("active");
    button.setAttribute("aria-current", "page");
});


});
