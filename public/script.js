document.addEventListener('DOMContentLoaded', () => {
    fetch('/getYarnInventory')
      .then(response => response.json())
      .then(data => displayInventory(data))
      .catch(error => console.error('Error:', error));
});
  
function displayInventory(data) {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('inventory-item');
        const imageUrl = item.fotosHilos.ruta ? item.fotosHilos.ruta : 'https://static.vecteezy.com/system/resources/previews/005/723/771/non_2x/photo-album-icon-image-symbol-or-no-image-flat-design-on-a-white-background-vector.jpg';
        const descriptionImageUrl = item.fotosDescripcionesHilos.ruta ? item.fotosDescripcionesHilos.ruta : 'https://static.vecteezy.com/system/resources/previews/005/723/771/non_2x/photo-album-icon-image-symbol-or-no-image-flat-design-on-a-white-background-vector.jpg';
        
        // Verificar rutas de imágenes
        console.log('Image URL:', imageUrl);
        console.log('Description Image URL:', descriptionImageUrl);

        const colorBand = getColorBand(item.yarn_type);
        itemDiv.innerHTML = `
            <h3>${item.item}</h3>
            <p><strong>Código:</strong> ${item.cod}</p>
            <p><strong>Descripción:</strong> ${item.description}</p>
            <p><strong>Vendedor:</strong> ${item.vendor}</p>
            <p><strong>Tipo de Hilo:</strong> ${item.yarn_type}</p>
            <div>
                <h4>Fotos del Hilo:</h4>
                <img src="${imageUrl}" alt="${item.fotosHilos.nombre}" class="${item.fotosHilos.ruta ? '' : 'no-image'}">
            </div>
            <div>
                <h4>Fotos de Descripción:</h4>
                <img src="${descriptionImageUrl}" alt="${item.fotosDescripcionesHilos.nombre}" class="${item.fotosDescripcionesHilos.ruta ? '' : 'no-image'}">
            </div>
            <div class="color-band" style="background-color: ${colorBand};"></div>
        `;
        inventoryDiv.appendChild(itemDiv);
    });
}

function filterYarnInventory() {
    const yarnType = document.getElementById('yarnType').value;
    fetch(`/getYarnByType?yarn_type=${yarnType}`)
      .then(response => response.json())
      .then(data => displayInventory(data))
      .catch(error => console.error('Error:', error));
}
  
function getColorBand(yarnType) {
    switch (yarnType.toLowerCase()) {
      case 'polyester':
        return '#ff5722'; // Naranja
      case 'cotton':
        return '#4caf50'; // Verde
      case 'wool':
        return '#2196f3'; // Azul
      case 'silk':
        return '#9c27b0'; // Púrpura
      default:
        return '#607d8b'; // Gris
    }
}
