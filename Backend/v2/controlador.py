# controlador.py
import sys

# Intentamos importar los módulos, si falla, mostramos un mensaje de error
try:
    from modulos.calculo import realizar_calculo  # Importamos el módulo de cálculos
except ImportError as e:
    print("Error al importar el módulo de cálculos:", e)
    realizar_calculo = (
        None  # Si falla la importación, asignamos None para evitar errores más adelante
    )

try:
    from modulos.graficas import generar_grafico  # Importamos el módulo de gráficos
except ImportError as e:
    print("Error al importar el módulo de gráficos:", e)
    generar_grafico = None  # Asignamos None si falla la importación

try:
    from modulos.almacenamiento import (
        guardar_datos,
    )  # Importamos el módulo de almacenamiento
except ImportError as e:
    print("Error al importar el módulo de almacenamiento:", e)
    guardar_datos = None  # Asignamos None si falla la importación

try:
    from modulos.interfaz_usuario import (
        InterfazUsuario,
    )  # Importamos la interfaz de usuario
except ImportError as e:
    print("Error al importar el módulo de la interfaz de usuario:", e)
    InterfazUsuario = None  # Asignamos None si falla la importación


class Controlador:
    def __init__(self):
        """Inicializa el controlador y la interfaz de usuario"""
        if InterfazUsuario:
            self.ui = InterfazUsuario(
                self
            )  # Creamos la interfaz y le pasamos el controlador como argumento
            self.ui.mostrar()  # Mostramos la UI al inicio
        else:
            print(
                "No se pudo cargar la interfaz de usuario. El programa no tiene una interfaz gráfica."
            )

    def ejecutar_accion(self, accion, **kwargs):
        """
        Gestiona las acciones del usuario y dirige las tareas a los módulos correspondientes.

        Parámetros:
            accion (str): La acción que el usuario desea realizar (e.g., 'calculo', 'grafico', 'guardar')
            **kwargs: Argumentos adicionales necesarios para la acción (por ejemplo, datos para calcular o graficar)
        """
        if accion == "calculo" and realizar_calculo:
            tipo_calculo = kwargs.get("tipo_calculo")
            valores = kwargs.get("valores")
            resultado = realizar_calculo(
                tipo_calculo, valores
            )  # Llamamos al módulo de cálculo
            if self.ui:
                self.ui.mostrar_resultado(resultado)  # Mostramos el resultado en la UI

        elif accion == "grafico" and generar_grafico:
            datos = kwargs.get("datos")
            generar_grafico(datos)  # Llamamos al módulo de gráficos
            if self.ui:
                self.ui.mostrar_mensaje(
                    "Gráfico generado."
                )  # Informamos al usuario en la UI

        elif accion == "guardar" and guardar_datos:
            nombre_archivo = kwargs.get("nombre_archivo")
            datos = kwargs.get("datos")
            guardar_datos(nombre_archivo, datos)  # Llamamos al módulo de almacenamiento
            if self.ui:
                self.ui.mostrar_mensaje(
                    f"Datos guardados en {nombre_archivo}"
                )  # Confirmación en la UI

        else:
            if self.ui:
                self.ui.mostrar_mensaje(
                    "Acción no soportada o módulo no disponible."
                )  # Si la acción no es válida o el módulo está ausente


if __name__ == "__main__":
    controlador = (
        Controlador()
    )  # Inicializamos el controlador cuando se ejecuta el programa
