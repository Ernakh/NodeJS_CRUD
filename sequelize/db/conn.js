const {Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  'nodejs', 'admin', 'admin',
  {
    host:'localhost',
    dialect:'postgresql',
    define: 
    {
      timestamps: false
    }
  });

  
  try 
  { 
    sequelize.authenticate();
    console.log('conectado');
  }
  catch(err)
  {
    console.log(err);
  } 

  module.exports = sequelize