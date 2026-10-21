
const DATA_FILE = "SocialShield_Fictional_Profiles.json";

let profiles = [];

const fields = {
  age: "age",
  city: "city",
  university: "university",
  major: "major",
  workplace: "workplace",
  postingTime: "posting_time"
};

// Step 1: Load fictional profiles
async function loadProfiles() {
  try {
    const response = await fetch(DATA_FILE);

    if (!response.ok) {
      throw new Error("Could not load the dataset.");
    }

    profiles = await response.json();

    if (!Array.isArray(profiles)) {
      throw new Error("Dataset must contain an array.");
    }

    populateDropdowns();
    updateResults();

  } catch (error) {
    console.error(error);
    document.getElementById("riskMessage").textContent =
      "Error loading dataset. Check the JSON filename and local server.";
  }
}

// Step 2: Fill dropdowns with dataset values
function populateDropdowns() {
  for (const [elementId, field] of Object.entries(fields)) {
    const select = document.getElementById(elementId);

    const values = [...new Set(
      profiles
        .map(profile => profile[field])
        .filter(value => value !== null && value !== undefined)
    )];

    values.sort((a, b) =>
      String(a).localeCompare(String(b), undefined, {
        numeric: true
      })
    );

    values.forEach(value => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(value);
      select.appendChild(option);
    });

    select.addEventListener("change", updateResults);
  }
}

// Step 3: Get selected clues
function getSelectedClues() {
  const clues = {};

  for (const [elementId, field] of Object.entries(fields)) {
    const value = document.getElementById(elementId).value;

    if (value !== "") {
      clues[field] = value;
    }
  }

  return clues;
}

// Step 4: Find matching fictional profiles
function findMatches(clues) {
  return profiles.filter(profile =>
    Object.entries(clues).every(
      ([field, value]) => String(profile[field]) === value
    )
  );
}

// Step 5: Update the results
function updateResults() {
  const clues = getSelectedClues();
  const matches = findMatches(clues);

  const count = matches.length;
  const total = profiles.length;
  const selectedCount = Object.keys(clues).length;

  document.getElementById("matchCount").textContent =
    `${count} / ${total}`;

  const percentage = total === 0 ? 0 : (count / total) * 100;

  document.getElementById("progressFill").style.width =
    `${percentage}%`;

  const message = document.getElementById("riskMessage");

  if (selectedCount === 0) {
    message.textContent =
      "Select clues to see how the possible identities narrow down.";
    message.style.color = "#596178";

  } else if (count === 0) {
    message.textContent =
      "No fictional profiles match these clues.";
    message.style.color = "#596178";

  } else if (count === 1) {
    message.textContent =
      "Unique match! These clues identify one record in our fictional dataset.";
    message.style.color = "#c44343";

  } else {
    message.textContent =
      `${count} fictional profiles share these clues. ` +
      "Adding more clues may narrow the possibilities.";
    message.style.color = "#b07825";
  }
  updateClueSteps();
  refreshProtectionSimulator();
}

// Step 6: Reset selections

function resetClues() {
  Object.keys(fields).forEach(elementId => {
    document.getElementById(elementId).value = "";
  });

  discoveredPosts.clear();

  renderSocialPosts();
  updateDiscoveredClues();
  updateResults();
}


document.getElementById("resetBtn")
  .addEventListener("click", resetClues);


function updateClueSteps() {
  const container = document.getElementById("clueSteps");
  const clues = getSelectedClues();

  // Start with every fictional profile.
  let currentMatches = [...profiles];

  container.innerHTML = "";

  // First stage: the entire dataset.
  addClueStep(
    container,
    "All fictional profiles",
    currentMatches.length,
    profiles.length
  );

  // Apply each selected clue one at a time.
  for (const [field, value] of Object.entries(clues)) {

    currentMatches = currentMatches.filter(
      profile => String(profile[field]) === value
    );

    const readableName = Object.entries(fields)
      .find(([id, key]) => key === field)?.[0] || field;

    const label =
      readableName.replace(/([A-Z])/g, " $1") + " = " + value;

    addClueStep(
      container,
      label,
      currentMatches.length,
      profiles.length
    );
  }
}

function addClueStep(container, label, count, total) {
  const percentage = total === 0 ? 0 : (count / total) * 100;

  const step = document.createElement("div");
  step.className = "clue-step";

  if (count === 1) {
    step.classList.add("unique");
  }

  const header = document.createElement("div");
  header.className = "clue-step-header";

  const labelElement = document.createElement("span");
  labelElement.className = "clue-step-label";
  labelElement.textContent = label;

  const countElement = document.createElement("span");
  countElement.className = "clue-step-count";
  countElement.textContent = count + " profiles";

  header.append(labelElement, countElement);

  const progress = document.createElement("div");
  progress.className = "clue-progress";

  const fill = document.createElement("div");
  fill.className = "clue-progress-fill";
  fill.style.width = percentage + "%";

  progress.appendChild(fill);

  const explanation = document.createElement("p");
  explanation.className = "clue-explanation";

  if (count === 1) {
    explanation.textContent =
      "Unique match in this fictional dataset.";
  } else if (count === 0) {
    explanation.textContent =
      "No fictional profiles match all clues so far.";
  } else {
    explanation.textContent =
      `${percentage.toFixed(1)}% of the original profiles remain.`;
  }

  step.append(header, progress, explanation);
  container.appendChild(step);
}


/*
  FEATURE 3: Social Media Post Investigation

  All posts and clues are fictional.
*/

const fictionalPosts = [
  {
    text: "Celebrating my 21st birthday today! 🎂",
    field: "age",
    value: 21,
    clue: "Age = 21"
  },
  {
    text: "Beautiful evening here in Al Ain! 🌇",
    field: "city",
    value: "Al Ain",
    clue: "City = Al Ain"
  },
  {
    text: "Another busy day at University B! 📚",
    field: "university",
    value: "University B",
    clue: "University = University B"
  }
];

const discoveredPosts = new Set();

// Create the fictional posts on the page.
function renderSocialPosts() {
  const container = document.getElementById("socialPosts");
  container.innerHTML = "";

  fictionalPosts.forEach((post, index) => {
    const card = document.createElement("div");
    card.className = "social-post";

    const text = document.createElement("p");
    text.className = "post-text";
    text.textContent = post.text;

    const bottom = document.createElement("div");
    bottom.className = "post-bottom";

    const clue = document.createElement("span");
    clue.className = "post-clue";

    clue.textContent = discoveredPosts.has(index)
      ? post.clue
      : "Clue not revealed";

    const button = document.createElement("button");
    button.className = "investigate-btn";

    button.textContent = discoveredPosts.has(index)
      ? "Undo"
      : "Investigate";

    button.addEventListener("click", () => {
      togglePost(index);
    });

    bottom.append(clue, button);
    card.append(text, bottom);
    container.appendChild(card);
  });
}

// Reveal or remove a clue.
function togglePost(index) {
  const post = fictionalPosts[index];

  if (discoveredPosts.has(index)) {
    discoveredPosts.delete(index);

    // Only clear the dropdown if it still
    // contains this post's clue.
    const select = document.querySelector(
      `[id="${getSelectId(post.field)}"]`
    );

    if (select && select.value === String(post.value)) {
      select.value = "";
    }

  } else {
    discoveredPosts.add(index);

    // Apply the clue to the existing dropdown.
    const selectId = getSelectId(post.field);
    const select = document.getElementById(selectId);

    if (select) {
      select.value = String(post.value);
    }
  }

  renderSocialPosts();
  updateDiscoveredClues();
  updateResults();
}

// Convert dataset field names to dropdown IDs.
function getSelectId(field) {
  const entry = Object.entries(fields)
    .find(([id, key]) => key === field);

  return entry ? entry[0] : field;
}

// Display all discovered clues.
function updateDiscoveredClues() {
  const container = document.getElementById(
    "discoveredClues"
  );

  container.innerHTML = "";

  if (discoveredPosts.size === 0) {
    container.textContent = "No clues discovered yet.";
    return;
  }

  discoveredPosts.forEach(index => {
    const clue = document.createElement("div");
    clue.className = "discovered-clue";
    clue.textContent = "✓ " + fictionalPosts[index].clue;

    container.appendChild(clue);
  });
}

// Reset the post investigation.
function clearInvestigation() {
  discoveredPosts.clear();

  fictionalPosts.forEach(post => {
    const selectId = getSelectId(post.field);
    const select = document.getElementById(selectId);

    if (select) {
      select.value = "";
    }
  });

  renderSocialPosts();
  updateDiscoveredClues();
  updateResults();
}

document.getElementById("clearInvestigationBtn")
  .addEventListener("click", clearInvestigation);

renderSocialPosts();


/*
  FEATURE 4: Privacy Protection Simulator
*/

const protectedFields = new Set();

function renderProtectionOptions() {
  const container = document.getElementById(
    "protectionOptions"
  );

  container.innerHTML = "";

  const clues = getSelectedClues();

  // Remove protection choices that no longer
  // correspond to active clues.
  for (const field of [...protectedFields]) {
    if (!(field in clues)) {
      protectedFields.delete(field);
    }
  }

  const labels = {
    age: "Hide Age",
    city: "Hide City",
    university: "Hide University",
    major: "Hide Major",
    workplace: "Hide Workplace",
    posting_time: "Hide Posting Time"
  };

  if (Object.keys(clues).length === 0) {
    container.textContent =
      "Select or investigate clues first.";
    return;
  }

  Object.keys(clues).forEach(field => {
    const wrapper = document.createElement("div");
    wrapper.className = "protection-option";

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = protectedFields.has(field);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        protectedFields.add(field);
      } else {
        protectedFields.delete(field);
      }

      updateProtectionResults();
    });

    const text = document.createElement("span");
    text.textContent = labels[field] || `Hide ${field}`;

    label.append(checkbox, text);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function updateProtectionResults() {
  const originalClues = getSelectedClues();

  const protectedClues = { ...originalClues };

  // Remove selected information from the
  // simulated after-protection scenario.
  protectedFields.forEach(field => {
    delete protectedClues[field];
  });

  const before = findMatches(originalClues).length;
  const after = findMatches(protectedClues).length;

  document.getElementById("beforeCount").textContent =
    before;

  document.getElementById("afterCount").textContent =
    after;

  const message = document.getElementById(
    "protectionMessage"
  );

  if (Object.keys(originalClues).length === 0) {
    message.textContent =
      "Choose some clues above to begin.";
  } else if (protectedFields.size === 0) {
    message.textContent =
      "Select information to hide and compare the results.";
  } else if (after > before) {
    message.textContent =
      `Hiding these clues increases the possible ` +
      `matches from ${before} to ${after}. ` +
      "This reduces uniqueness within the fictional dataset.";
  } else {
    message.textContent =
      "These changes did not increase the number " +
      "of matching profiles in this dataset.";
  }
}

function refreshProtectionSimulator() {
  renderProtectionOptions();
  updateProtectionResults();
}

function resetProtection() {
  protectedFields.clear();
  refreshProtectionSimulator();
}

document.getElementById("resetProtectionBtn")
  .addEventListener("click", resetProtection);

loadProfiles();
