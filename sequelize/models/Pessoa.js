const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Pessoa = db.define('Pessoa', 
{
    id: 
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano_nascimento:
    {
        type: DataTypes.INTEGER,
        allowNull: true
    }
    
},
{
    tableName: "pessoas",
    timestamps: false
}
);

module.exports = Pessoa;