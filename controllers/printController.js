const printService = require('../services/printService');
const printerUtil = require('../utils/printerUtil');

exports.printOrder = async (req, res) => {
  const { teamId } = req.body;
  const filePath = req.file.path;

  if (!filePath || !teamId) {
    return res.status(400).send('Faltan parámetros filePath o teamId');
  }

  try {
    const isAvailable = await printerUtil.isPrinterAvailable(printService.printerName);
    if (!isAvailable) {
      return res.status(500).send('La impresora no está disponible en este momento');
    }

    printService.insertPrintOrder(teamId, (err, orderNumber) => {
      if (err) {
        console.error('Error al insertar la orden de impresión:', err);
        return res.status(500).send('Error al insertar la orden de impresión');
      }
      printService.printFile(filePath, orderNumber, res);
    });
  } catch (err) {
    console.error('Error al verificar la disponibilidad de la impresora:', err);
    res.status(500).send('Error al verificar la disponibilidad de la impresora');
  }
};
