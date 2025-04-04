document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const toggleSearchButton = document.getElementById("toggle-search-type");
    const resultsDiv = document.getElementById("results");
    const repoResultsDiv = document.getElementById("repo-results");

    let searchType = "user"; // Default search type (user)

    // API base URL and headers
    const baseUrl = "https://api.github.com/";

    // Toggle search type between 'user' and 'repo'
    toggleSearchButton.addEventListener("click", () => {
        searchType = searchType === "user" ? "repo" : "user";
        toggleSearchButton.textContent = searchType === "user" ? "Search for Users" : "Search for Repositories";
        resultsDiv.innerHTML = ''; // Clear results
        repoResultsDiv.innerHTML = ''; // Clear repo results
    });

    // Event listener for search button click
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (!query) return;

        if (searchType === "user") {
            searchUsers(query);
        } else {
            searchRepos(query);
        }
    });

    // Function to search for GitHub users
    async function searchUsers(query) {
        const url = `${baseUrl}search/users?q=${query}`;
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        });
        const data = await response.json();
        displayUsers(data.items);
    }

    // Function to search for GitHub repositories
    async function searchRepos(query) {
        const url = `${baseUrl}search/repositories?q=${query}`;
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        });
        const data = await response.json();
        displayRepos(data.items);
    }

    // Function to display search results for users
    function displayUsers(users) {
        resultsDiv.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50" />
                <h3>${user.login}</h3>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;
            userDiv.addEventListener("click", () => {
                searchUserRepos(user.login);
            });
            resultsDiv.appendChild(userDiv);
        });
    }

    // Function to search repositories of a specific user
    async function searchUserRepos(username) {
        const url = `${baseUrl}users/${username}/repos`;
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        });
        const data = await response.json();
        displayRepos(data);
    }

    // Function to display search results for repositories
    function displayRepos(repos) {
        repoResultsDiv.innerHTML = '';
        repos.forEach(repo => {
            const repoDiv = document.createElement("div");
            repoDiv.classList.add("repo");
            repoDiv.innerHTML = `
                <h4>${repo.name}</h4>
                <p>${repo.description || "No description"}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            repoResultsDiv.appendChild(repoDiv);
        });
    }
});

