import Categoria from "./Categorias.js";
import Comida from "./Comidas.js";
import Item from "./Items.js";
import Mesa from "./Mesas.js";
import Opcion from "./Opciones.js";
import Orden from "./Ordenes.js";
import Variante from "./Variantes.js";
import comida_variante from "./Comida_Variante.js";
import Item_Opcion from "./Item_Opcion.js";
import Waiter from "./Waiters.js";
import Seccion from "./Secciones.js";

Comida.belongsTo(Categoria, { foreignKey: "categoriaId" }); //Tiene un o una //la llave pasa de B a A

Comida.belongsToMany(Variante, { through: comida_variante }); //muchos a muchos
//Comida.hasMany(Variante) //Tiene muchos o muchas de A a B

Item.belongsTo(Comida, { foreignKey: "comidaId" }); //Tiene un o una

Orden.belongsTo(Mesa, { foreignKey: "mesaId" }); //Tiene un o una   //la llabe pasara a A

Orden.hasMany(Item, { foreignKey: "ordenId" }); //Tiene muchos o muchas   //la llave pasara a B

//Variante.hasMany(Opcion)//Tiene muchos o muchas  // A a B
Variante.hasMany(Opcion, { foreignKey: "varianteId" });

Item.belongsToMany(Opcion, { through: Item_Opcion });

Orden.belongsTo(Waiter, { foreignKey: "waiterId" });

Seccion.hasMany(Mesa, { foreignKey: "seccionId" }); // una seccion tiene muchas mesas // la llave pasa A => B

//Propiedad.belongsTo(Usuario,{foreignKey:'usuarioId'})
export {
  Categoria,
  Comida,
  Item,
  Mesa,
  Opcion,
  Orden,
  Variante,
  comida_variante,
  Item_Opcion,
  Waiter,
  Seccion,
};
