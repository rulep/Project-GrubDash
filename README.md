## Project description: GrubDash

You've been hired as a backend developer for a new startup called GrubDash! As another developer works on the design and frontend experience, you have been tasked with setting up an API and building out specific routes so that the frontend developers can demo some initial design ideas for the big bosses.

For detailed instructions on how to complete this project, consult the *Instructions* document in the Qualified assessment interface.

## Learning objectives

This project will test your ability to build APIs with complex validation. Before taking on this project, you should be comfortable with the learning objectives listed below:

- Running tests from the command line
- Using common middleware packages
- Receiving requests through routes
- Accessing relevant information through route parameters
- Building an API following RESTful design principles
- Writing custom middleware functions

## Tasks

1. In the `src/dishes/dishes.controller.js` file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.
2. In the `src/dishes/dishes.router.js` file, add two routes: `/dishes` and `/dishes/:dishId`. Attach the handlers (create, read, update, and list) exported from `src/dishes/dishes.controller.js`.
3. In the `src/orders/orders.controller.js` file, add handlers and middleware functions to create, read, update, delete, and list orders.
4. In the `src/orders/orders.router.js` file, add two routes: `/orders` and `/orders/:orderId`. Attach the handlers (create, read, update, delete, and list) exported from `src/orders/orders.controller.js`.
5. Anytime you need to assign a new `id` to an order or dish, use the `nextId` function exported from `src/utils/nextId.js`

## Project rubric

For your project to pass, all of the following statements must be true.

- All tests are passing in Qualified.
- All middleware and handler functions have a single responsibility and are named functions.
- All data passed between middleware and handler functions uses `response.locals`.
- All chained method calls on a `route(...)` end with `all(methodNotAllowed)`.
- All update handlers guarantee that the `id` property of the stored data cannot be overwritten.