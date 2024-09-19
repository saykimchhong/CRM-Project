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

document.getElementById('googleSignInBtn').addEventListener('click', function () {
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in: ', result.user);
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            updateUserInfo(result.user);
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

document.getElementById('signOutBtn').addEventListener('click', function () {
    auth.signOut()
        .then(() => {
            document.getElementById('loginModal').style.display = 'block';
            document.getElementById('mainContent').style.display = 'none';
            clearUserInfo();
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        handleSignIn(user);
        updateUserInfo(user);
    } else {
        document.getElementById('loginModal').style.display = 'block';
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

function updateUserInfo(user) {
    const photoURL = user.photoURL || 'default-profile.png';
    console.log('User Photo URL:', photoURL);
    document.getElementById('userPhoto').src = photoURL;
    document.getElementById('userName').textContent = user.displayName || 'User Name';
    document.getElementById('userEmail').textContent = user.email || 'user@example.com';
}

function clearUserInfo() {
    document.getElementById('userPhoto').src = 'default-profile.png';
    document.getElementById('userName').textContent = '';
    document.getElementById('userEmail').textContent = '';
}
