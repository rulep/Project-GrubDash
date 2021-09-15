const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware
function isBody(req, res, next) {
  const dish = req.body;
  if (dish) {
    res.locals.body = dish;
    next();
  } else {
    console.log("Request had no body");
    next();
  }
}

function dishIsValid(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id == dishId);
  if (foundDish) {
    res.locals.foundDish = foundDish;
    next();
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
}

function routeIdMatchesBody(req, res, next) {
  const dishId = req.params.dishId;
  const id = req.body.data.id;
  if (!id) next();
  if (dishId == id) {
    next();
  } else {
    next({
      status: 400,
      message: `Dish id did not match route id. \nDish: ${id}, Route: ${dishId}`,
    });
  }
}

function nameIsValid(req, res, next) {
  const dish = res.locals.body.data;
  if (dish.name && dish.name !== "") {
    next();
  } else {
    next({
      status: 400,
      message: "Dish must include a name",
    });
  }
}

function descriptionIsValid(req, res, next) {
  const dish = res.locals.body.data;
  if (dish.description) {
    next();
  } else {
    next({
      status: 400,
      message: "Dish must include a description",
    });
  }
}

function priceIsIncluded(req, res, next) {
  const dish = res.locals.body.data;
  if (dish.price) {
    next();
  } else {
    next({
      status: 400,
      message: "Dish must include a price",
    });
  }
}

function priceIsValid(req, res, next) {
  const dish = res.locals.body.data;
  if (dish.price > 0 && Number.isInteger(dish.price)) {
    next();
  } else {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
}

function imageIsValid(req, res, next) {
  const dish = res.locals.body.data;
  if (dish.image_url) {
    next();
  } else {
    next({
      status: 400,
      message: "Dish must include an image_url",
    });
  }
}

// End Points
function list(req, res) {
  res.send({ data: dishes });
}

function read(req, res) {
  res.send({ data: res.locals.foundDish });
}

function update(req, res) {
  const dish = res.locals.foundDish;
  const { name, description, price, image_url } = res.locals.body.data;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.status(200).send({ data: dish });
}

function create(req, res) {
  const newDish = { ...res.locals.body.data, id: nextId() };
  dishes.push(newDish);
  res.status(201).send({ data: newDish });
}

module.exports = {
  list,
  read: [dishIsValid, read],
  update: [
    isBody,
    dishIsValid,
    routeIdMatchesBody,
    nameIsValid,
    descriptionIsValid,
    priceIsIncluded,
    priceIsValid,
    imageIsValid,
    update,
  ],
  create: [
    isBody,
    nameIsValid,
    descriptionIsValid,
    priceIsIncluded,
    priceIsValid,
    imageIsValid,
    create,
  ],
};