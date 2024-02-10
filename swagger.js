const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
      title: 'HAW Hamburg: Studierendenprojekte API',
      description: 'Die API ermöglicht den Zugriff auf die Datenbank der Studierendenprojekte der HAW Hamburg. Sie ermöglicht das Anlegen, Bearbeiten und Löschen von Projekten sowie das Anlegen von Benutzerkonten. Die API ist durch JWT-Authentifizierung geschützt.'
    },
    host: 'localhost:3000'
  };

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/projects.js', './routes/user.js']

swaggerAutogen(outputFile, endpointsFiles, doc);