console.log("Skycast is starting");

console.log(document.title);

const navigationButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");

function showScreen(targetScreenId) {
screens.forEach(function (screen) {
const isTargetScreen = screen.id === targetScreenId;

    screen.hidden = !isTargetScreen;
    screen.classList.toggle("active", isTargetScreen);
});

navigationButtons.forEach(function (button) {
    const isTargetButton = button.dataset.screen === targetScreenId;

    button.classList.toggle("active", isTargetButton);

    if (isTargetButton) {
        button.setAttribute("aria-current", "page");
    } else {
        button.removeAttribute("aria-current");
    }
});

}

navigationButtons.forEach(function (button) {
button.addEventListener("click", function () {
showScreen(button.dataset.screen);
});
});
