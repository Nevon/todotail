# Todotail

A simple todo-application.

## Requirements

* `python` >= 3.3
* `pip`
* `virtualenv`
* `virtualenvwrapper` (recommended)

## Installation

1. Clone the repo

    git clone https://github.com/Nevon/todotail.git

2. `cd` into it

    cd todotail/

3. (Optional) Create a virtualenv

    mkvirtualenv --no-site-packages todotail

4. Install dependencies

    pip install -r requirements.txt

5. Run the server

    ./run.py

Then go to `http://localhost:5000` in your web browser.

## Structure

`Flask` handles all requests, routing them either to our `angularjs` application at `/`, or to the API at `/api/`.

The application uses `flask-restless` to provide the API endpoints. Currently there's just the one endpoint, `/api/todo`, 
which responds to standard `GET`, `POST`, `DELETE` and `PUT` requests. There's no authentication or user-specific todo
lists, so everyone shares the same list.

An `angular` application is served from the `static` directory, which uses `restangular` to consume data from the API.

The data is saved in an `sqlite` database in the root of the project. Since the application uses SQLAlchemy as its 
database access layer, swapping out `sqlite` for something more robust should be fairly trivial.
    