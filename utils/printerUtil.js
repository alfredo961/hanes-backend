const { exec } = require('child_process');

exports.isPrinterAvailable = (printerName) => {
  return new Promise((resolve, reject) => {
    exec(`wmic printer where name="${printerName}" get PrinterStatus`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando el comando: ${error.message}`);
        return reject(false);
      }
      if (stderr) {
        console.error(`Error en el comando: ${stderr}`);
        return reject(false);
      }
      console.log(`Estado de la impresora ${printerName}: ${stdout}`);
      const status = stdout.includes('3'); // 3 generalmente significa "Idle" (lista para imprimir)
      resolve(status);
    });
  });
};
