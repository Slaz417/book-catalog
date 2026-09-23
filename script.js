document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    let books = [];

    // Load the CSV file
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbvq2XHTejLB_tg8rtZ0lvtoHeBg8bMuTL4_JCy4B28eNWi9g7vcspNNMXkrVonhww6fb4df3jfn_c/pub?gid=0&single=true&output=csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    books = results.data;
                    displayResults(books); // Show all books when page loads
                }
            });
        });

    // Function to render the book cards
    function displayResults(data) {
        resultsContainer.innerHTML = '';
       
        if (data.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No matching books found. Try adjusting your search!</div>';
            return;
        }

        data.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
           
            // Build the card content safely
            bookCard.innerHTML = `
                <h3>${book.Title || 'Unknown Title'}</h3>
                <p><strong>Author:</strong> ${book['Author First Name'] || ''} ${book['Author Last Name'] || ''}</p>
                <p><strong>Category:</strong> ${book.Category || 'Uncategorized'}</p>
                <p><strong>Location:</strong> 📍 ${book.Location || 'Unknown'}</p>
            `;
            resultsContainer.appendChild(bookCard);
        });
    }

    // Filter books when typing in the search bar
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
       
        const filteredBooks = books.filter(book => {
            const title = book.Title ? book.Title.toLowerCase() : '';
            const authorFirst = book['Author First Name'] ? book['Author First Name'].toLowerCase() : '';
            const authorLast = book['Author Last Name'] ? book['Author Last Name'].toLowerCase() : '';
            const category = book.Category ? book.Category.toLowerCase() : '';
            const location = book.Location ? book.Location.toLowerCase() : '';

            return title.includes(query) ||
                   authorFirst.includes(query) ||
                   authorLast.includes(query) ||
                   category.includes(query) ||
                   location.includes(query);
        });
       
        displayResults(filteredBooks);
    });
});
