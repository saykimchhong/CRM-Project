document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        // Function to update user info
        function updateUserInfo() {
            document.querySelectorAll('#userPhoto').forEach((img) => (img.src = userData.photo));
            document.querySelectorAll('#userName').forEach((p) => (p.textContent = userData.name));
            document.querySelectorAll('#userEmail').forEach((p) => (p.textContent = userData.email));
        }

        // Update user info on page load
        updateUserInfo();
    }
});
