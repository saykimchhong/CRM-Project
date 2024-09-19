// Firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyAndPLb2MlrU5pLQlzjei7wdD_lfl-vsP8',
    authDomain: 'project03-empty.firebaseapp.com',
    projectId: 'project03-empty',
    storageBucket: 'project03-empty.appspot.com',
    messagingSenderId: '181299938153',
    appId: '1:181299938153:web:76244f389fe358f8b1b3f8',
};

// Initialize Firebase using the compat version
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Function to show the login modal
function showLoginModal() {
    document.getElementById('loginModalOverlay').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'block';
}

// Function to hide the login modal
function hideLoginModal() {
    document.getElementById('loginModalOverlay').style.display = 'none';
    document.getElementById('loginModal').style.display = 'none';
}

// Google Sign-In button event listener
document.getElementById('googleSignInBtn').addEventListener('click', function () {
    auth.signInWithPopup(provider)
        .then((result) => {
            hideLoginModal();
            document.getElementById('mainContent').style.display = 'block';
            handleSignIn(result.user); // Store the user data

            // Update user info after successful sign-in
            updateUserInfo();
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
            alert('An error occurred. Please try again.', error);
        });
});

// Sign-Out button event listener
document.getElementById('signOutBtn').addEventListener('click', function () {
    auth.signOut()
        .then(() => {
            showLoginModal(); // Show modal after sign-out
            document.getElementById('mainContent').style.display = 'none';
            clearUserInfo();

            // Close the offcanvas menu if it's active
            if ($('.offCanvas__info').hasClass('active')) {
                $('.offCanvas__info, .offCanvas__overly').removeClass('active');
            }

            // Close the mobile menu if it's active
            if (document.querySelector('.mobile-header-active').classList.contains('sidebar-visible')) {
                document.querySelector('.mobile-header-active').classList.remove('sidebar-visible');
            }
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        hideLoginModal();
        document.getElementById('mainContent').style.display = 'block';
        handleSignIn(user);

        // Update user info when auth state changes to signed-in
        updateUserInfo();
    } else {
        showLoginModal();
        document.getElementById('mainContent').style.display = 'none';
    }
});

function handleSignIn(user) {
    const userData = {
        photo: user.photoURL,
        name: user.displayName,
        email: user.email,
    };

    // Store user data in sessionStorage
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Function to update user info (updated to handle multiple elements)
function updateUserInfo() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        document.querySelectorAll('#userPhoto').forEach((img) => (img.src = userData.photo));
        document.querySelectorAll('#userName').forEach((p) => (p.textContent = userData.name));
        document.querySelectorAll('#userEmail').forEach((p) => (p.textContent = userData.email));
    }
}

function clearUserInfo() {
    document.getElementById('userPhoto').src = 'default-profile.png';
    document.getElementById('userName').textContent = '';
    document.getElementById('userEmail').textContent = '';
}
