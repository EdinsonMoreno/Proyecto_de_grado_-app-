# modulos/almacenamiento.py
import pickle
from cryptography.fernet import Fernet


class Almacenamiento:
    def __init__(self, clave=None):
        """
        Inicializa el objeto de almacenamiento. Si no se proporciona una clave,
        genera una nueva clave para cifrado.

        Parámetros:
            clave (str): Clave de cifrado en formato string (opcional).
        """
        if clave is None:
            self.clave = self.generar_clave()  # Generar una nueva clave
        else:
            self.clave = clave  # Usar la clave proporcionada
        self.cifrado = Fernet(self.clave)  # Instanciar el objeto de cifrado

    def generar_clave(self):
        """
        Genera una nueva clave para cifrado usando Fernet.
        """
        return Fernet.generate_key().decode()

    def guardar_documento(self, datos, archivo):
        """
        Guarda los datos en un archivo cifrado.

        Parámetros:
            datos (object): Los datos a guardar (pueden ser cualquier objeto de Python).
            archivo (str): El nombre del archivo donde se guardarán los datos.
        """
        # Serializamos los datos
        datos_serializados = pickle.dumps(datos)
        # Ciframos los datos serializados
        datos_cifrados = self.cifrado.encrypt(datos_serializados)

        with open(archivo, "wb") as file:
            file.write(datos_cifrados)  # Guardamos los datos cifrados

    def cargar_documento(self, archivo):
        """
        Carga los datos desde un archivo cifrado.

        Parámetros:
            archivo (str): El nombre del archivo desde donde se cargarán los datos.

        Retorna:
            object: Los datos deserializados y descifrados.
        """
        with open(archivo, "rb") as file:
            datos_cifrados = file.read()  # Leemos el archivo cifrado

        # Desciframos los datos
        datos_descifrados = self.cifrado.decrypt(datos_cifrados)
        # Deserializamos los datos
        datos = pickle.loads(datos_descifrados)
        return datos

    def obtener_clave(self):
        """
        Retorna la clave de cifrado utilizada para cifrar y descifrar.

        Retorna:
            str: La clave de cifrado en formato string.
        """
        return self.clave


# Ejemplo de uso
if __name__ == "__main__":
    # Crear instancia del módulo de almacenamiento
    almacen = Almacenamiento()

    # Datos a almacenar
    datos = {"nombre": "Juan", "edad": 30, "email": "juan@example.com"}

    # Guardar los datos en un archivo cifrado
    archivo = "documento_seguro.dat"
    almacen.guardar_documento(datos, archivo)
    print(f"Datos guardados en {archivo} de manera segura.")

    # Cargar los datos desde el archivo cifrado
    datos_cargados = almacen.cargar_documento(archivo)
    print(f"Datos cargados: {datos_cargados}")
