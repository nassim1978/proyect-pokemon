const fs = require('fs');

// Archivos de origen y destino
const originalDataFile = 'original-pokemon-data.json';
const targetDataFile = 'pokemon-data.json';

// Función para restaurar los datos
function restoreData() {
  try {
    // Verificar si el archivo original existe
    if (!fs.existsSync(originalDataFile)) {
      throw new Error(`El archivo ${originalDataFile} no existe.`);
    }

    // Leer los datos originales
    const originalData = JSON.parse(fs.readFileSync(originalDataFile, 'utf-8'));

    // Asegurarse de que los datos estén envueltos en un objeto con la propiedad "pokemon"
    const formattedData = { pokemon: originalData.pokemon || originalData };

    // Sobrescribir el archivo de datos actual
    fs.writeFileSync(targetDataFile, JSON.stringify(formattedData, null, 2));

    console.log('Datos restaurados correctamente desde original-pokemon-data.json');
  } catch (error) {
    console.error('Error al restaurar los datos:', error.message);
  }
}

module.exports = restoreData;

// Ejecutar la función automáticamente si el archivo se llama directamente
if (require.main === module) {
  restoreData();
}
