const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Learning Academy API",
    description: "API for managing task",
  },
  host: "cse341-learning-academy.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc);