# SentIA

### Como ejecutar

El proyecto tiene dos partes: el servidor (server/), y la interfaz web (client/). 

#### Servidor

Para poder ejecutar el servidor, primero se tiene que instalar el entorno Pipenv. Para ello, es necesario el paquete [pipenv](https://pypi.org/project/pipenv/). Una vez instalado, dentro de la carpeta server/, se puede ejecutar el siguiente comando para configurar el entorno:

```
pipenv install
```

Con esto se instalarán los paquetes de los que depende el proyecto. También es necesario instalar [Torch](https://pytorch.org/), escogiendo o CPU o CUDA dependiendo del ordenador en el que se ejecuta.

Una vez instalado, se debe entrar dentro del entorno pipenv y correr el servidor de la siguiente manera:

```
pipenv shell   # Entrar dentro del entorno
python3 api.py # Ejecutar el servidor
```

Esto puede tardar un tiempo dado que se tienen que descargar todos los modelos.

#### Cliente web

Para ejecutar el cliente web, tiene que estar corriendo el servidor. Después, dentro de la carpeta client/, se deben intalar todas las dependencias con el siguiente comando:
```
npm install
```

Una vez instalados, se puede correr el servidor del cliente de la siguiente manera:
```
npm run-script dev
```

### Autores
David Mate (david.mate@estudiantat.upc.edu)

Adrià Vaquer (adria.vaquer@estudiantat.upc.edu)

Adria Lozano (adria.lozano.julian@estudiantat.upc.edu)

Jan Samaranch (jan.samaranch.i@estudiantat.upc.edu)
