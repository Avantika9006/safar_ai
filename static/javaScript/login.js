/* =========================
   PASSWORD VISIBILITY
========================= */

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener("click", () => {

    const icon =
        togglePassword.querySelector("i");


    if (password.type === "password") {

        password.type = "text";

        icon.classList.remove(
            "fa-eye"
        );

        icon.classList.add(
            "fa-eye-slash"
        );

    } else {

        password.type = "password";

        icon.classList.remove(
            "fa-eye-slash"
        );

        icon.classList.add(
            "fa-eye"
        );

    }

});



/* =========================
   LOGIN FORM
========================= */

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const passwordValue =
            password.value;


        if (!email || !passwordValue) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        loginMessage.textContent =
            "Logging you in...";


        /*
            This is only frontend behavior.

            Later you can replace this
            with your backend API call.
        */

        setTimeout(() => {

            loginMessage.textContent =
                "Login successful! ✈️";

        }, 1000);

    }
);