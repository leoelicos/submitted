# submitted

![express](https://img.shields.io/badge/4.18.1-0?label=Express&style=for-the-badge&labelColor=white&color=black) ![handlebars](https://img.shields.io/badge/6.0.6-0?label=express-handlebars&style=for-the-badge&labelColor=white&color=black) ![sequelize](https://img.shields.io/badge/6.20.1-0?label=Sequelize&style=for-the-badge&labelColor=white&color=black) ![mysql2](https://img.shields.io/badge/2.3.3-0?label=mysql2&style=for-the-badge&labelColor=white&color=black)

---

## why 

Read and create blogs.

This application uses npm packages `express`, `express-handlebars`, `express-session`, `sequelize`, `connection-session-sequelize`, `bcrypt`, `mysql2` and `dotenv`.

CRUD API calls are also defined for back end development allow a developer to test requests using Insomnia to prepare for front-end integration in the future.

As defined in [Issues](https://github.com/leoelicos/submitted/issues), my future direction for submitted includes options to create Categories and Tags on the front end, as well as select them while creating a Blog. Currently they can only be created from the back end.

I made this application to learn about full-stack applications created with Model-View-Controller, and I used GitHub Projects and various Pull Requests to create this app: https://github.com/leoelicos/submitted/projects/1

## Table of Contents

- [Usage](#usage)
- [Screenshots](#screenshots)
- [Installation for API testing in Insomnia](#installation-for-api-testing-in-insomnia)
- [Example of API response](#example-of-api-response)
- [Credits](#credits)
- [License](#license)

## Usage

Visit [submitted](https://leoelicos-tech-blog.herokuapp.com/) on a browser on a computer or mobile.

### Video Demo:

https://user-images.githubusercontent.com/99461390/171432484-b0d20930-92b8-4f02-bcb3-d773507a1ed9.mp4

Video is also on YouTube: https://youtu.be/E2-GN5ZVDKY

## Screenshots

### Screenshot: submitted Homepage

![Screenshot: submitted Homepage](https://user-images.githubusercontent.com/99461390/171438307-e5865051-f739-4fd2-b2cd-1b5caa0095ef.jpg)

### Screenshot: submitted Dashboard

![Screenshot: submitted Dashboard](https://user-images.githubusercontent.com/99461390/171438325-6877551d-5875-4637-afe1-ac88fab85520.jpg)

### Screenshot: submitted Login

![Screenshot: submitted Login](https://user-images.githubusercontent.com/99461390/171438328-941e8bf3-d929-42d9-854b-82c66c726d18.jpg)

## Installation for API testing in Insomnia

### 0. Required

| Programs   | Download links                             |
| ---------- | ------------------------------------------ |
| `Node`     | https://nodejs.org/en/download/            |
| `Mysql`    | https://dev.mysql.com/downloads/installer/ |
| `Insomnia` | https://insomnia.rest/download             |

### 1. Git clone and go inside

```sh
git clone https://github.com/leoelicos/submitted.git

cd submitted
```

### 2. Rename `.env.EXAMPLE` to `.env`

```sh
mv .env.Example .env
```

Input your Mysql credentials. _Don't forget to save!_

- `DB_USER={username}`
- `DB_PASSWORD={password}`

### 3. Go inside `db`, invoke `Mysql`, enter {password}, run `schema`

```sh
cd db

mysql -u root -p

{password}

source schema.sql;

exit
```

### 4. Return to root, install dependencies, (optionally) run seed

```sh
cd ..

npm install

npm run seed

```

### 5. Start the server, then access the API with Insomnia

```sh
npm start
```

## API

### Base URL

All URLs start with `http://localhost:3001/api/`.

No API key is required. You will need to either log in, or sign up and be logged in, in order to receive the responses.

---

### Searching

GET request to `/{type}` searches for items which have a specified type.

Possible types include:

- blogs: `blog`
- categories: `category`
- tags: `tag`
- blog-tags links: `blogtag`
- comments: `comment`
- users: `user`

**Example**:

```sh
GET http://localhost:3001/api/blog
```

---

### Requesting a specific item

GET request to `/{type}/{id}` searches for items which have a specified type and specified id.

Possible types include:

- a blog: `blog`
- a blog category: `category`
- a tag: `tag`
- a blog-tag link: `blogtag`
- a comment: `comment`
- a user: `user`

**Example**:

```sh
GET http://localhost:3001/api/blog/1
```

---

### Adding a specific item

POST request to `/{type}/` adds an item of the specified type. You need to include a JSON with a valid body.

Possible types and the JSON body:

| `{type}`   | JSON                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `blog`     | `{ "title": STRING, "user_id": INTEGER, "category_id": INTEGER, "summary": STRING, "text": STRING }` |
| `blogtag`  | `{ "blog_id": INTEGER, "tag_id": INTEGER }`                                                          |
| `category` | `{ "category_name": STRING }`                                                                        |
| `comment`  | `{ "text": STRING, "user_id": INTEGER, "blog_id": INTEGER }`                                         |
| `tag`      | `{ "tag_name": STRING }`                                                                             |
| `user`     | `{ "username": STRING, "password": STRING }`                                                         |

**Example**

```sh
POST http://localhost:3001/api/tags/
{ "tag_name": "Express" }
```

---

### Editing a specific item

PUT request to `/{type}/{id}` edits an item of the specified type. You need to include a JSON with a valid body.

Possible types and the JSON body:

| `{type}`   | JSON                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `blog`     | `{ "title": STRING, "user_id": INTEGER, "category_id": INTEGER, "summary": STRING, "text": STRING }` |
| `blogtag`  | `{ "blog_id": INTEGER, "tag_id": INTEGER }`                                                          |
| `category` | `{ "category_name": STRING }`                                                                        |
| `comment`  | `{ "text": STRING, "user_id": INTEGER, "blog_id": INTEGER }`                                         |
| `tag`      | `{ "tag_name": STRING }`                                                                             |
| `user`     | `{ "username": STRING, "password": STRING }`                                                         |

**Example**

```sh
PUT http://localhost:3001/api/comment/1
{ "text": "Good advice!", "user_id": 2, "blog_id": 1 }
```

---

### Deleting a specific item

DELETE request to `/{type}/{id}` deletes items which have a specified type and specified id.

Possible types include:

- a blog: `blog`
- a blog category: `category`
- a tag: `tag`
- a blog-tag link: `blogtag`
- a comment: `comment`
- a user: `user`

**Example**:

```sh
DELETE http://localhost:3001/api/category/1
```

---

## Example of API response

Request:

```sh
GET http://localhost:3001/api/category
```

Response:

```json
[
  {
    "id": 1,
    "category_name": "Homework"
  },
  {
    "id": 2,
    "category_name": "Challenges"
  },
  {
    "id": 3,
    "category_name": "Projects"
  },
  {
    "id": 4,
    "category_name": "Mini-projects"
  }
]
```

## Credits

- BCS Resources
- [Normalize.css](https://necolas.github.io)

## License

&copy; Leo Wong <leoelicos@gmail.com>

Licensed under the [MIT License](./LICENSE).
