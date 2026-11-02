/*
 * Read the assessment result saved by assessment.html.
 */

const savedResults =
    localStorage.getItem("privacyResults");

const riskHeading =
    document.getElementById("riskHeading");

const scoreText =
    document.getElementById("scoreText");

const recommendationsList =
    document.getElementById("recommendationsList");


/*
 * Advice connected to each assessment question.
 */

const privacyAdvice = {
    question1: {
        title: "Make your account private",
        why:
            "A public account allows strangers to view your posts, photographs, and personal details.",
        action:
            "Open your social-media privacy settings and change your account visibility to Private."
    },

    question2: {
        title: "Disable live-location sharing",
        why:
            "Live-location sharing can reveal where you live, study, work, or spend time.",
        action:
            "Turn off location access and avoid adding your live location to posts."
    },

    question3: {
        title: "Hide your contact information",
        why:
            "A public phone number or email address can lead to spam, scams, and unwanted contact.",
        action:
            "Remove your phone number and email address from your public profile."
    },

    question4: {
        title: "Hide your complete date of birth",
        why:
            "Your complete date of birth can be used for identity theft or account-recovery attacks.",
        action:
            "Show only your birth month or hide your birthday completely."
    },

    question5: {
        title: "Avoid requests from strangers",
        why:
            "Unknown accounts may be fake profiles created for scams or information collection.",
        action:
            "Accept requests only from people you know and verify suspicious profiles."
    },

    question6: {
        title: "Use a different password for every account",
        why:
            "If one reused password is stolen, several of your accounts may become exposed.",
        action:
            "Create a unique password for every account and use a password manager."
    },

    question7: {
        title: "Avoid links from unknown accounts",
        why:
            "Unknown links may lead to phishing websites, scams, or harmful downloads.",
        action:
            "Do not open suspicious links. Verify the sender before clicking."
    },

    question8: {
        title: "Reduce identifying information",
        why:
            "Your school, workplace, and home area can be combined to identify or locate you.",
        action:
            "Remove unnecessary school, workplace, and home-location details from your public profile."
    },

    question9: {
        title: "Post travel information later",
        why:
            "Posting travel plans can tell strangers when you are away from home.",
        action:
            "Share travel photographs and information after you return."
    },

    question10: {
        title: "Review your privacy settings",
        why:
            "Social-media privacy settings may change when platforms introduce new features.",
        action:
            "Check your privacy settings regularly and limit who can view your information."
    },

    question11: {
        title: "Remove unnecessary application permissions",
        why:
            "Applications may access your camera, contacts, location, or photographs without needing them.",
        action:
            "Review application permissions and disable access that is not required."
    },

    question12: {
        title: "Check photographs before posting",
        why:
            "Photographs may reveal addresses, identification cards, uniforms, badges, or location clues.",
        action:
            "Check the background of every photograph and remove identifying details before posting."
    }
};


/*
 * Show a message if the user has not completed
 * the assessment.
 */

if (!savedResults) {
    riskHeading.textContent =
        "Complete the Privacy Assessment First";

    scoreText.textContent =
        "We need your assessment answers before we can provide personalized recommendations.";

    const assessmentLink =
        document.createElement("a");

    assessmentLink.href = "assessment.html";
    assessmentLink.className = "button";
    assessmentLink.textContent =
        "Take Privacy Assessment";

    recommendationsList.appendChild(
        assessmentLink
    );
} else {
    try {
        const results =
            JSON.parse(savedResults);

        displayRecommendations(results);
    } catch (error) {
        riskHeading.textContent =
            "Unable to Read Your Results";

        scoreText.textContent =
            "Please complete the privacy assessment again.";

        console.error(
            "Invalid privacyResults data:",
            error
        );
    }
}


/*
 * Display the user's risk score and recommendations.
 */

function displayRecommendations(results) {
    riskHeading.textContent =
        "Your Privacy Risk: " +
        results.riskLevel;

    scoreText.textContent =
        "Your score is " +
        results.rawScore +
        "/24 (" +
        results.totalScore +
        "%).";

    const answers =
        results.answers || {};

    let recommendationCount = 0;

    for (let number = 1; number <= 12; number++) {
        const questionName =
            "question" + number;

        const answerValue =
            Number(answers[questionName]);

        if (answerValue > 0) {
            const advice =
                privacyAdvice[questionName];

            createRecommendation(
                advice,
                answerValue
            );

            recommendationCount++;
        }
    }

    /*
     * Display a safe message if every answer is No.
     */

    if (recommendationCount === 0) {
        const safeMessage =
            document.createElement("div");

        safeMessage.className =
            "recommendation-item safe";

        safeMessage.innerHTML =
            "<h3>Great privacy habits!</h3>" +
            "<p>Your answers did not show any major privacy risks.</p>" +
            "<p>Continue reviewing your settings and protecting your personal information.</p>";

        recommendationsList.appendChild(
            safeMessage
        );
    }
}


/*
 * Create one recommendation card.
 */

function createRecommendation(
    advice,
    answerValue
) {
    const recommendation =
        document.createElement("article");

    recommendation.className =
        "recommendation-item";

    const priority =
        answerValue === 2
            ? "High Priority"
            : "Medium Priority";

    const priorityClass =
        answerValue === 2
            ? "high-priority"
            : "medium-priority";

    recommendation.innerHTML =
        '<span class="' +
        priorityClass +
        '">' +
        priority +
        "</span>" +

        "<h3>" +
        advice.title +
        "</h3>" +

        "<p><strong>Why it matters:</strong> " +
        advice.why +
        "</p>" +

        "<p><strong>What to do:</strong> " +
        advice.action +
        "</p>";

    recommendationsList.appendChild(
        recommendation
    );
}
