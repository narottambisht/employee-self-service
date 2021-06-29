const dataFile = require('../../utils/dataFile');
const Clients = require('../../models/clients');
const UUID = require('uuid');

exports.getClients = (req, res, next) => {
  res.render('admin/clients/syncClients', { countries: dataFile.countryList });
}

exports.syncClients = async (req, res, next) => {
  const { clientName, country, id } = req.body;
  if (id === '') {
    let client = await Clients.create({ name: clientName, country: country });
    if (client)
      res.redirect('/admin/clients');
  } else {
    let updateClientResult = await Clients.update({ name: clientName, country }, { where: { id } });
    if (updateClientResult.length)
      res.redirect('/admin/clients');
  }
}

exports.getClientsList = async (req, res, next) => {
  let clients = await Clients.findAll({
    raw: true
  });
  res.render('admin/clients/clientslist', { clients });
}

exports.deleteClient = async (req, res, next) => {
  let rowId = req.params.id;
  let result = await Clients.destroy({ where: { id: rowId } });
  res.send({ status: result });
}

exports.updateClient = async (req, res, next) => {
  let client = await Clients.findOne({
    raw: true,
    where: { id: req.params.id }
  });
  res.render('admin/clients/syncClients', { client, countries: dataFile.countryList });
}