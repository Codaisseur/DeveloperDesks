"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("desks", [
      {
        uri:
          "https://res.cloudinary.com/daxjf54p3/image/upload/v1601306412/hmvcvmdpj3dqgca4vtqk.jpg",
        developerId: 1,
        latitude: 49.3880614,
        longitude: 3.823527,
        createdAt: new Date(2020, 8, 10),
        updatedAt: new Date(2020, 8, 10),
      },
      {
        uri:
          "https://res.cloudinary.com/daxjf54p3/image/upload/v1601299132/pgzw8qoegk56qbnpatac.jpg",
        developerId: 2,
        latitude: 48.3880614,
        longitude: 3.323527,
        createdAt: new Date(2020, 7, 16),
        updatedAt: new Date(2020, 7, 16),
      },
      {
        uri:
          "https://res.cloudinary.com/daxjf54p3/image/upload/v1601299126/kdcdh6jtrw1qwwpjopjt.jpg",
        developerId: 3,
        latitude: 50.3880614,
        longitude: 4.023527,
        createdAt: new Date(2020, 7, 5),
        updatedAt: new Date(2020, 7, 5),
      },
      {
        uri:
          "https://res.cloudinary.com/daxjf54p3/image/upload/v1601299119/dpsbdc0hq2qr9jebk5zh.jpg",
        developerId: 4,
        latitude: 52.3880614,
        longitude: 4.823527,
        createdAt: new Date(2020, 9, 13),
        updatedAt: new Date(2020, 9, 13),
      },
      {
        uri:
          "https://res.cloudinary.com/daxjf54p3/image/upload/v1601298639/dmi3ccpbwbauyotcx5ui.jpg",
        developerId: 5,
        latitude: 51.3880614,
        longitude: 4.223527,
        createdAt: new Date(2020, 9, 18),
        updatedAt: new Date(2020, 9, 18),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("desks");
  },
};
