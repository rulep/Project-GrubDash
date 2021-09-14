const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Middleware
function hasBody(req, res, next) {
  const body = req.body;
  if (body) {
    res.locals.body = body;
    next();
  } else {
    next();
  }
}

function idExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.orderId = orderId;
    res.locals.foundOrder = foundOrder;
    next();
  } else {
    next({
      status: 404,
      message: `Id ${orderId} not found`,
    });
  }
}

function routeIdMatchesBody(req, res, next) {
  const id = req.body.data.id;
  if (res.locals.orderId == id || !id) {
    next();
  } else {
    next({
      status: 400,
      message: `Order id did not match route id. \nOrder: ${id}, Route: ${res.locals.orderId}`,
    });
  }
}

function hasDeliverTo(req, res, next) {
  if (res.locals.body.data.deliverTo) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include a deliverTo",
    });
  }
}

function hasMobileNumber(req, res, next) {
  if (res.locals.body.data.mobileNumber) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include a mobileNumber",
    });
  }
}

function hasStatus(req, res, next) {
  const status = res.locals.body.data.status;
  if (
    status === "pending" ||
    status === "preparing" ||
    status === "out-for-delivery" ||
    status === "delivered"
  ) {
    next();
  } else {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
}

function statusIsValid(req, res, next) {
  if (res.locals.body.data.status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  } else {
    next();
  }
}

function statusPending(req, res, next) {
  if (res.locals.foundOrder.status !== "pending") {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  } else {
    next();
  }
}

function hasDishes(req, res, next) {
  const dishes = res.locals.body.data.dishes;
  if (dishes && dishes[0] && Array.isArray(dishes)) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
}

function hasQuantities(req, res, next) {
  const data = res.locals.body.data;
  const noQuantityIndex = data.dishes.findIndex(
    (dish) =>
      !dish.quantity || !dish.quantity > 0 || !Number.isInteger(dish.quantity)
  );
  if (noQuantityIndex !== -1) {
    next({
      status: 400,
      message: `Dish ${noQuantityIndex} must have a quantity that is an integer greater than 0`,
    });
  } else {
    next();
  }
}

// End Points
function list(req, res) {
  res.send({ data: orders });
}

function read(req, res) {
  res.send({ data: res.locals.foundOrder });
}

function update(req, res) {
  const order = res.locals.foundOrder;
  const { deliverTo, mobileNumber, status, dishes } = res.locals.body.data;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  res.send({ data: order });
}

function create(req, res) {
  const newOrder = { ...res.locals.body.data, id: nextId() };
  orders.push(newOrder);
  res.status(201).send({ data: newOrder });
}

function destroy(req, res) {
  const indexToDestroy = orders.findIndex(
    (order) => order.id === res.locals.orderId
  );
  orders.splice(indexToDestroy, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [idExists, read],
  update: [
    hasBody,
    idExists,
    routeIdMatchesBody,
    hasDeliverTo,
    hasMobileNumber,
    hasStatus,
    statusIsValid,
    hasDishes,
    hasQuantities,
    update,
  ],
  create: [
    hasBody,
    hasDeliverTo,
    hasMobileNumber,
    hasDishes,
    hasQuantities,
    create,
  ],
  delete: [idExists, statusPending, destroy],
};