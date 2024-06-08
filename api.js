async function convertirDivisa() {
    const monto = document.getElementById('cantidad').value;
    const divisaOrigen = "USD";
    const divisaDestino = "MXN";

    if (divisaOrigen === divisaDestino) {
        document.getElementById('resultado').innerText = `${monto} ${divisaOrigen} es igual a ${monto} ${divisaDestino}`;
        return;
    }

    try {
        const apiKey = 'a5305d3be15956a45586ed89c5b79db3b167b5bd645908e22c214cc40d94ad48';  // Tu API Key de Banxico
        const respuesta = await fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=${apiKey}`);
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener el tipo de cambio');
        }

        const datos = await respuesta.json();
        console.log('Respuesta completa de la API:', datos);  // Imprime la respuesta completa de la API

        const series = datos.bmx.series;
        let tipoCambio = 0;

        series.forEach(serie => {
            console.log(`ID de la Serie: ${serie.idSerie}, Dato: ${serie.datos[0]?.dato}`);  // Imprime los IDs y datos de las series
            if (serie.idSerie === 'SF43718') {  // ID de la serie para USD a MXN
                tipoCambio = parseFloat(serie.datos[0]?.dato);
            }
        });

        console.log(`Tipo de cambio: ${tipoCambio}`);

        if (tipoCambio === 0) {
            throw new Error('No se encontró el tipo de cambio para USD a MXN.');
        }

        const conversion = monto * tipoCambio;

        document.getElementById('resultado').innerText = `${monto} ${divisaOrigen} equivale a ${conversion.toFixed(2)} ${divisaDestino}`;
    } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
        document.getElementById('resultado').innerText = 'Error al obtener el tipo de cambio. Por favor, inténtalo más tarde.';
    }
}
