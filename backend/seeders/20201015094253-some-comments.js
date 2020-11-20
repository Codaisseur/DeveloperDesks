"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("comments", [
      {
        title: "Clean Desk Policy",
        content: "You desk is a mess",
        deskId: "5",
        developerId: "5",
        createdAt: new Date(2020, 8, 10),
        updatedAt: new Date(2020, 8, 10),
      },
      {
        title: "Great spot",
        content: "That's a hell of a desk man",
        deskId: "2",
        developerId: "2",
        createdAt: new Date(2020, 8, 10),
        updatedAt: new Date(2020, 8, 10),
      },
      {
        title: "Tip from me",
        content: "You should get a cleaner",
        deskId: "3",
        developerId: "3",
        createdAt: new Date(2020, 8, 10),
        updatedAt: new Date(2020, 8, 10),
      },
      {
        title: "Social distancing is not a joke",
        content: "Dwight",
        deskId: "4",
        developerId: "4",
        createdAt: new Date(2020, 8, 10),
        updatedAt: new Date(2020, 8, 10),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("comments");
  },
};
