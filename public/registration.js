document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.querySelector('.sign-up');
    const inputs = signUpForm.querySelectorAll('input');
    const username = inputs[0];
    const phone = inputs[1];
    const email = inputs[2];
    const password = inputs[3];
    const confirmPassword = inputs[4];
    const submitBtn = signUpForm.querySelector('button');

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        let messages = [];
        let valid = true;

        if (username.value.trim().length < 3) {
            valid = false;
            messages.push("Username must be at least 3 characters.");
        }

        if (!/^\d{10}$/.test(phone.value)) {
            valid = false;
            messages.push("Phone number must be exactly 10 digits.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            valid = false;
            messages.push("Enter a valid email address.");
        }

        if (password.value.length < 6) {
            valid = false;
            messages.push("Password must be at least 6 characters.");
        }

        if (password.value !== confirmPassword.value) {
            valid = false;
            messages.push("Passwords do not match.");
        }

        // ✅ reCAPTCHA v2 validation
        const captchaToken = grecaptcha.getResponse();
        if (!captchaToken) {
            valid = false;
            messages.push("Please complete the CAPTCHA.");
        }

        if (!valid) {
            alert(messages.join("\n"));
            return;
        }

        // Send data to server
        const formData = {
            username: username.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            password: password.value,
            confirmPassword: confirmPassword.value,
            "g-recaptcha-response": captchaToken
        };

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            alert(result.message);

            if (response.ok) {
                signUpForm.reset();
                grecaptcha.reset(); // reset captcha
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting form. Try again.");
        }
    });
});
