
document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.querySelector('.sign-up-htm');
    const username = signUpForm.querySelector('#user');
    const phone = signUpForm.querySelector('#phone');
    const password = signUpForm.querySelectorAll('#pass')[0];
    const repeatPassword = signUpForm.querySelectorAll('#pass')[1];
    const email = signUpForm.querySelectorAll('#pass')[2];
    const adminCode = signUpForm.querySelector('#code');
    const submitBtn = signUpForm.querySelector('.button');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission for validation

        // Regex for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation flags
        let valid = true;
        let messages = [];

        // Username
        if (username.value.trim().length < 3) {
            valid = false;
            messages.push("Username must be at least 3 characters.");
        }

        // Phone
        if (!/^\d{10}$/.test(phone.value)) {
            valid = false;
            messages.push("Phone number must be 10 digits.");
        }

        // Password
        if (password.value.length < 6) {
            valid = false;
            messages.push("Password must be at least 6 characters.");
        }

        // Repeat Password
        if (password.value !== repeatPassword.value) {
            valid = false;
            messages.push("Passwords do not match.");
        }

        // Email
        if (!emailRegex.test(email.value)) {
            valid = false;
            messages.push("Invalid email address.");
        }

        // Admin Code
        if (adminCode.value !== "ADMIN2025") {
            valid = false;
            messages.push("Admin Code must be ADMIN2025.");
        }

        if (!valid) {
            alert(messages.join("\n"));
        } else {
            alert("Admin registered successfully!");
            signUpForm.reset();
        }
    });
});

