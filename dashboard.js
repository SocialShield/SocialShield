const sampleResults = {
    totalScore: 72,
    riskLevel: "High Risk",

    categories: {
        accountVisibility: 75,
        personalInformation: 80,
        locationSharing: 60,
        strangerInteraction: 75
    },

    riskyHabits: [
        "Your account is public.",
        "You share personal information.",
        "You share your location.",
        "You accept requests from strangers."
    ]
};


/*
 * Get the results saved by assessment.html.
 */
function getResults() {
    const savedResults =
        localStorage.getItem("privacyResults");

    if (savedResults) {
        try {
            return JSON.parse(savedResults);
        } catch (error) {
            console.error(
                "The saved assessment result is invalid.",
                error
            );
        }
    }

    return sampleResults;
}


const results = getResults();


/*
 * Display the assessment results.
 */
function displayDashboard() {
    document.getElementById("score").textContent =
        results.totalScore + "%";

    document.getElementById("riskLevel").textContent =
        results.riskLevel;

    document.getElementById("beforeScore").textContent =
        results.totalScore + "%";

    document.getElementById("afterScore").textContent =
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


    /*
     * Display the risky habits.
     */
    const habitsList =
        document.getElementById("riskyHabits");

    habitsList.innerHTML = "";

    if (
        Array.isArray(results.riskyHabits) &&
        results.riskyHabits.length > 0
    ) {
        results.riskyHabits.forEach(function (habit) {
            const item =
                document.createElement("li");

            item.textContent = habit;

            habitsList.appendChild(item);
        });
    } else {
        const item =
            document.createElement("li");

        item.textContent =
            "No major risky habits were found.";

        habitsList.appendChild(item);
    }
}


/*
 * Display one category as a percentage.
 */
function displayCategory(barId, scoreId, score) {
    let percentage = Number(score);

    if (Number.isNaN(percentage)) {
        percentage = 0;
    }

    if (percentage < 0) {
        percentage = 0;
    }

    if (percentage > 100) {
        percentage = 100;
    }

    document.getElementById(barId).style.width =
        percentage + "%";

    document.getElementById(scoreId).textContent =
        percentage + "%";
}


/*
 * Return a description for the total score.
 */
function getDescription(score) {
    if (score <= 33) {
        return "Your privacy habits are relatively safe.";
    }

    if (score <= 66) {
        return "Some of your online habits create privacy risks.";
    }

    return "Several habits may expose too much personal information.";
}


/*
 * The number of points removed by each
 * improvement in the simulator.
 */
const improvements = {
    privateAccount: 15,
    disableLocation: 12,
    hidePersonalInfo: 10,
    blockStrangers: 10
};


/*
 * Listen for changes to simulator checkboxes.
 */
Object.keys(improvements).forEach(function (id) {
    const checkbox = document.getElementById(id);

    if (checkbox) {
        checkbox.addEventListener(
            "change",
            updateSimulator
        );
    }
});


/*
 * Recalculate the risk after the user
 * selects privacy improvements.
 */
function updateSimulator() {
    let newScore = results.totalScore;

    Object.keys(improvements).forEach(function (id) {
        const checkbox = document.getElementById(id);

        if (checkbox && checkbox.checked) {
            newScore -= improvements[id];
        }
    });

    if (newScore < 0) {
        newScore = 0;
    }

    const improvement =
        results.totalScore - newScore;

    document.getElementById("afterScore").textContent =
        newScore + "%";

    document.getElementById("improvement").textContent =
        "Improvement: " +
        improvement +
        " percentage points";

    document.getElementById("newRiskLevel").textContent =
        "New risk level: " +
        getRiskLevel(newScore);
}


/*
 * Return the new risk level.
 */
function getRiskLevel(score) {
    if (score <= 33) {
        return "Low Risk";
    }

    if (score <= 66) {
        return "Medium Risk";
    }

    return "High Risk";
}


/*
 * Run the dashboard when the page opens.
 */
displayDashboard();
updateSimulator();
