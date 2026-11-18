
const http = require("http");
const fs = require("fs");

let books = [
    {id: 1, author: "Chetan Bhagat", title: "Five Point Someone", category: "Fiction"},
    {id: 2, author: "R.K. Narayan", title: "Malgudi Days", category: "Stories"},
    {id: 3, author: "Shakespeare", title: "Hamlet", category: "Drama"}
];

const server = http.createServer((req, res) => {

    if (req.url == "/" && req.method == "GET") {
        fs.readFile("MT1practical.html", (err, data) => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        });
    }

    else if (req.url == "/books" && req.method == "GET") {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(books));
    }

    else if (req.url.startsWith("/books/") && req.method == "GET") {
        let id = Number(req.url.split("/")[2]);
        let book = books.find(b => b.id == id);

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(book || {message: "Book not found"}));
    }

    else if (req.url == "/books" && req.method == "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            let book = JSON.parse(body);
            books.push(book);

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message: "Book added successfully"}));
        });
    }

    else if (req.url.startsWith("/books/") && req.method == "PUT") {
        let id = Number(req.url.split("/")[2]);
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            let book = books.find(b => b.id == id);

            if (book) {
                let data = JSON.parse(body);
                book.author = data.author;
                book.title = data.title;
                book.category = data.category;
            }

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: book ? "Book updated successfully" : "Book not found"
            }));
        });
    }

    else if (req.url.startsWith("/books/") && req.method == "DELETE") {
        let id = Number(req.url.split("/")[2]);
        let oldLength = books.length;

        books = books.filter(b => b.id != id);

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
            message: books.length < oldLength ? "Book deleted successfully" : "Book not found"
        }));
    }

    else {
        res.writeHead(404);
        res.end("Not Found");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
