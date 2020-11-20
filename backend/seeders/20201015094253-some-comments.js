"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "comments",
      [
        {
          title: "Nice desk!",
          content: "You have a nice desk!",
          deskId: 1,
          developerId: "4",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Hate it",
          content: "I don't like it, any of it. One could say: I HATE IT",
          deskId: 2,
          developerId: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "What?",
          content: "What is up with all the desks? I'm new here",
          deskId: 3,
          developerId: "2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("comments");
  },
};
