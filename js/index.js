document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const repositoryList = document.getElementById('repositoryList');

    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedFetchRepositories = debounce(function() {
        const searchText = searchInput.value;
        if (searchText.length > 0) {
            fetchRepositories(searchText);
        } else {
            suggestions.innerHTML = '';
        }
    }, 400);

    searchInput.addEventListener('input', debouncedFetchRepositories);

    function fetchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => response.json())
            .then(data => {
                showSuggestions(data.items);
            })
            .catch(error => console.error('Error:', error));
    }

    function showSuggestions(repositories) {
        suggestions.innerHTML = '';
        repositories.forEach(repo => {
            const div = document.createElement('div');
            div.textContent = repo.name;
            div.addEventListener('click', () => addRepositoryToList(repo));
            suggestions.appendChild(div);
        });
    }

    function addRepositoryToList(repo) {
        const li = document.createElement('li');
        li.innerHTML = `Name: ${repo.name}<br>Owner: ${repo.owner.login}<br>Stars: ${repo.stargazers_count}`;
        const removeBtn = document.createElement('span');
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => li.remove());
        li.appendChild(removeBtn);
        repositoryList.appendChild(li);
        suggestions.innerHTML = '';
        searchInput.value = '';
    }
});