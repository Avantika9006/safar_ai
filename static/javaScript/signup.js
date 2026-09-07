const signupForm =
    document.getElementById("signupForm");

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const signupMessage =
    document.getElementById("signupMessage");


/* =========================
   PASSWORD TOGGLE
========================= */

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
   SIGN UP
========================= */

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();


        /* PASSWORD CHECK */

        if (password.value.length < 6) {

            signupMessage.textContent =
                "Password must be at least 6 characters.";

            signupMessage.style.color =
                "#ef7045";

            return;
        }


        /* CONFIRM PASSWORD */

        if (
            password.value !==
            confirmPassword.value
        ) {

            signupMessage.textContent =
                "Passwords do not match.";

            signupMessage.style.color =
                "#ef7045";

            return;
        }


        /* SUCCESS */

        signupMessage.textContent =
            `Welcome to SafarAI, ${name}! ✈️`;

        signupMessage.style.color =
            "#277a4d";


        /*
            Backend/API can be connected here later.

            Example:

            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: password.value
                })
            });
        */

    }
);