const sampleResults = {
    totalScore: 72,
    riskLevel: "High Risk",

    categories: {
        accountVisibility: 18,
        personalInformation: 20,
        locationSharing: 15,
        strangerInteraction: 19
    },

    riskyHabits: [
        "Your account is public",
        "You share personal information",
        "You share your location",
        "You accept requests from strangers"
    ]
};

function getResults() {
    const savedResults = localStorage.getItem("privacyResults");

    if (savedResults) {
        return JSON.parse(savedResults);
    }

    return sampleResults;
}

const results = getResults();

function displayDashboard() {
    document.getElementById("score").textContent =
        results.totalScore + "%";

    document.getElementById("riskLevel").textContent =
        results.riskLevel;

    document.getElementById("beforeScore").textContent =
        results.totalScore + "%";

    document.getElementById("riskDescription").textContent =
        getDescription(results.totalScore);

    displayCategory(
        "visibilityBar",
        "visibilityScore",
        results.categories.accountVisibility
    );

    displayCategory(
        "personalBar",
        "personalScore",
        results.categories.personalInformation
    );

    displayCategory(
        "locationBar",
        "locationScore",
        results.categories.locationSharing
    );

    displayCategory(
        "strangerBar",
        "strangerScore",
        results.categories.strangerInteraction
    );

    const habitsList = document.getElementById("riskyHabits");

    results.riskyHabits.forEach(habit => {
        const item = document.createElement("li");
        item.textContent = habit;
        habitsList.appendChild(item);
    });
}

function displayCategory(barId, scoreId, score) {
    const percentage = (score / 25) * 100;

    document.getElementById(barId).style.width =
        percentage + "%";

    document.getElementById(scoreId).textContent =
        score + "/25";
}

function getDescription(score) {
    if (score <= 33) {
        return "Your privacy habits are relatively safe.";
    }

    if (score <= 66) {
        return "Some of your online habits create privacy risks.";
    }

    return "Several habits may expose too much personal information.";
}

const improvements = {
    privateAccount: 15,
    disableLocation: 12,
    hidePersonalInfo: 10,
    blockStrangers: 10
};

Object.keys(improvements).forEach(id => {
    document.getElementById(id).addEventListener(
        "change",
        updateSimulator
    );
});

function updateSimulator() {
    let newScore = results.totalScore;

    Object.keys(improvements).forEach(id => {
        const checkbox = document.getElementById(id);

        if (checkbox.checked) {
            newScore -= improvements[id];
        }
    });

    if (newScore < 0) {
        newScore = 0;
    }

    const improvement = results.totalScore - newScore;

    document.getElementById("afterScore").textContent =
        newScore + "%";

    document.getElementById("improvement").textContent =
        "Improvement: " + improvement + " points";

    document.getElementById("newRiskLevel").textContent =
        "New risk level: " + getRiskLevel(newScore);
}

function getRiskLevel(score) {
    if (score <= 33) {
        return "Low Risk";
    }

    if (score <= 66) {
        return "Medium Risk";
    }

    return "High Risk";
}
