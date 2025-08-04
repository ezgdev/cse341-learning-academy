const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Learning Academy API",
    description: "API for managing task",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc);