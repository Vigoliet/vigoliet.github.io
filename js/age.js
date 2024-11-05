function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function updateAge() {
    const birthday = '2002-07-07'; // Replace with your actual birthdate in YYYY-MM-DD format
    const ageElement = document.getElementById('age');
    ageElement.textContent = calculateAge(birthday);
}

document.addEventListener('DOMContentLoaded', updateAge);