// Mercado Pago SDK
const mercadopago = require ('mercadopago');
require ('dotenv').config();
// Add Your credentials
mercadopago.configure({
  access_token: 'TEST-7569963356469546-101215-d5e776db005307069b3dbb3b3d4761af-147335181',
});


// Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: product.name,
      unit_price: product.price,
      quantity: 1,
    },
  ],
};

mercadopago.preferences
  .create(preference)
  .then(function (response) {
    // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
  })
  .catch(function (error) {
    console.log(error);
  });


module.exports = {mercadopago}
