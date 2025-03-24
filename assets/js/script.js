const bookList = document.querySelector(".book-list");

let currentPage = 1;
let totalPages = 1;
let totalItem = 0;
let currentItem = 0;

async function getBookList() {
  const url = "https://api.freeapi.app/api/v1/public/books";
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

    displayBooks(data.data.data);

    totalPages = data.data.totalPages;
    currentPage = data.data.page;

  } catch (error) {
    console.error(error);
  }
}

function displayBooks(books) {
  // Clear previous books before displaying new ones
  bookList.innerHTML = "";

  books.forEach((book) => {
    const div = document.createElement("div");
    div.className = "card-container";

    const title = book.volumeInfo.title || "No Title Available";
    const subtitle = book.volumeInfo.subtitle || "No subtitle Available";
    const authors = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Unknown Author";
    const publisher = book.volumeInfo.publisher || "Unknown Publisher";
    const publishDate = book.volumeInfo.publishedDate || "Unknown Date";
    const thumbnail = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "";

    div.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <div class="book-info">
        <h3>${title}</h3>
        <p class="author"><strong>Authors:</strong> ${authors}</p>
        <p class="description"><strong>Description:</strong> ${subtitle}</p>
        <p><strong>Publisher:</strong> ${publisher}</p>
        <p><strong>Published:</strong> ${publishDate}</p>
      </div>
    `;
    bookList.appendChild(div); 
  });
}

getBookList();
