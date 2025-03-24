const bookList = document.querySelector(".book-list");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageInfo = document.getElementById("page-info");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let currentPage = 1;
const booksPerPage = 10; // Number of books per page
let allBooks = []; // Store all books fetched

// Fetch all books and store them
async function fetchAllBooks(query = "") {
  const url = `https://api.freeapi.app/api/v1/public/books?limit=1000&query=${query}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Error fetching books");
    const data = await response.json();

    allBooks = data.data.data; // Store all books globally
    totalPages = Math.ceil(allBooks.length / booksPerPage); // Calculate total pages

    sortAndDisplayBooks(); // Sort and display the first page
  } catch (error) {
    console.error(error);
  }
}

// Sort books and display the current page
function sortAndDisplayBooks() {
  const sortBy = sortSelect.value;

  if (sortBy === "title") {
    allBooks.sort((a, b) => {
      const titleA = a.volumeInfo.title?.toLowerCase() || "";
      const titleB = b.volumeInfo.title?.toLowerCase() || "";
      return titleA.localeCompare(titleB);
    });
  } else if (sortBy === "dateOfRelease") {
    allBooks.sort((a, b) => {
      const dateA = new Date(a.volumeInfo.publishedDate || "9999-12-31");
      const dateB = new Date(b.volumeInfo.publishedDate || "9999-12-31");
      return dateA - dateB;
    });
  }

  displayBooks(); // Display the sorted books for the current page
}

// Display books for the current page
function displayBooks() {
  bookList.innerHTML = ""; // Clear previous books

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToDisplay = allBooks.slice(start, end); // Get books for the current page

  booksToDisplay.forEach((book) => {
    const div = document.createElement("div");
    div.className = "card-container";

    const title = book.volumeInfo.title || "No Title Available";
    const authors = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Unknown Author";
    const publisher = book.volumeInfo.publisher || "Unknown Publisher";
    const publishDate = book.volumeInfo.publishedDate || "Unknown Date";
    const thumbnail = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "";

    const infoLink = book.volumeInfo.infoLink || "#";

    div.innerHTML = `
      <a href="${infoLink}" target="_blank" class="book-link">
    <img src="${thumbnail}" alt="${title}">
    <div class="book-info">
      <h3>${title}</h3>
      <p class="author"><strong>Authors:</strong> ${authors}</p>
      <p><strong>Publisher:</strong> ${publisher}</p>
      <p><strong>Published:</strong> ${publishDate}</p>
    </div>
  </a>
      </div>
    `;
    bookList.appendChild(div);
  });

  updatePagination(); // Update the pagination UI
}

// Update pagination UI
function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// Event listeners for pagination buttons
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayBooks(); // Display the previous page
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayBooks(); // Display the next page
  }
});

// Filter books by title or author
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  currentPage = 1; // Reset to the first page when searching
  fetchAllBooks(query);
});

// Sort books when sort option is changed
sortSelect.addEventListener("change", () => {
  sortAndDisplayBooks(); // Sort and update the current page
});

// Fetch books when the page loads
fetchAllBooks();

// Toggle view/list
const toggleViewButton = document.getElementById("toggleView");

toggleViewButton.addEventListener("click", () => {
  bookList.classList.toggle("list-view"); // Toggle class

  // Change button text based on view
  if (bookList.classList.contains("list-view")) {
    toggleViewButton.textContent = "Switch to Grid View";
  } else {
    toggleViewButton.textContent = "Switch to List View";
  }
});
