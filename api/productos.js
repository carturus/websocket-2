class Productos {
    constructor() {
        // incializar variables
        this.productos=[]
    }

    listar(id){
        if(id){
             if(id <=  this.productos.length)
                return this.productos[id-1]
             else
                return {error: "producto no encontrado"}
        }
        else{
            if(this.productos.length>0)
                return this.productos
            else
                return {error: "no hay productos cargados"}
        }
    }

    borrar(id){

             if(id <=  this.productos.length){
                let eliminado= this.productos[id-1]
                let orden=1;
                this.productos.splice(id-1, 1);

                this.productos.forEach(elemento=>{
                    elemento.id=orden
                    orden++

                })
                return eliminado
             }  
             else
                return {error: "producto no encontrado"}

    }
    editar(id,producto){

        if(id <=  this.productos.length){

            this.productos.splice(id-1, 1, {id: id,...producto})
       
           return this.productos[id-1]
        }  
        else
           return {error: "producto no encontrado"}

}


    guardar(producto){
        let id= this.productos.length+1;
        producto.price=parseInt(producto.price)
        this.productos.push({id: id,...producto})
        return this.productos[id-1]
    }
    // agregar los metodos requeridos
}

// exporto una instancia de la clase
module.exports = new Productos();