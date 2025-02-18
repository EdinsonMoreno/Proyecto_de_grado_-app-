# modulos/graficas.py
import matplotlib.pyplot as plt
import plotly.graph_objects as go


def generar_grafico(datos, tipo="linea", grafico_interactivo=False):
    """
    Genera un gráfico basado en los datos proporcionados.
    Puede ser un gráfico estático con Matplotlib o interactivo con Plotly.

    Parámetros:
        datos (list o dict): Los datos a graficar. Puede ser una lista de valores o un diccionario con varias series.
        tipo (str): Tipo de gráfico ('linea', 'barra', 'dispercion').
        grafico_interactivo (bool): Si es True, generará un gráfico interactivo con Plotly.
                                    Si es False, generará un gráfico estático con Matplotlib.

    Salida:
        Ninguna. Solo genera y muestra el gráfico.
    """
    if grafico_interactivo:
        generar_grafico_interactivo(datos, tipo)
    else:
        generar_grafico_estatico(datos, tipo)


def generar_grafico_estatico(datos, tipo="linea"):
    """
    Genera un gráfico estático usando Matplotlib.

    Parámetros:
        datos (list o dict): Los datos a graficar. Si es un diccionario, las claves serán las leyendas.
        tipo (str): Tipo de gráfico ('linea', 'barra', 'dispercion').

    Salida:
        Ninguna. Solo genera y muestra el gráfico.
    """
    plt.figure(figsize=(8, 6))

    if isinstance(datos, list):  # Si los datos son una lista, generamos una serie única
        if tipo == "linea":
            plt.plot(datos, label="Serie única", color="blue")
        elif tipo == "barra":
            plt.bar(range(len(datos)), datos, label="Serie única", color="blue")
        elif tipo == "dispercion":
            plt.scatter(range(len(datos)), datos, label="Serie única", color="blue")
        else:
            print("Tipo de gráfico no soportado.")
            return
    elif isinstance(
        datos, dict
    ):  # Si los datos son un diccionario con múltiples series
        for label, serie in datos.items():
            if tipo == "linea":
                plt.plot(serie, label=label)
            elif tipo == "barra":
                plt.bar(range(len(serie)), serie, label=label)
            elif tipo == "dispercion":
                plt.scatter(range(len(serie)), serie, label=label)
            else:
                print("Tipo de gráfico no soportado.")
                return

    plt.title(f"Gráfico de {tipo.capitalize()}")
    plt.xlabel("Índice")
    plt.ylabel("Valor")
    plt.legend()
    plt.grid(True)
    plt.show()


def generar_grafico_interactivo(datos, tipo="linea"):
    """
    Genera un gráfico interactivo usando Plotly.

    Parámetros:
        datos (list o dict): Los datos a graficar. Si es un diccionario, las claves serán las leyendas.
        tipo (str): Tipo de gráfico ('linea', 'barra', 'dispercion').

    Salida:
        Ninguna. Solo genera y muestra el gráfico.
    """
    if isinstance(datos, list):
        fig = go.Figure()
        if tipo == "linea":
            fig.add_trace(
                go.Scatter(
                    x=list(range(len(datos))), y=datos, mode="lines", name="Serie única"
                )
            )
        elif tipo == "barra":
            fig.add_trace(
                go.Bar(x=list(range(len(datos))), y=datos, name="Serie única")
            )
        elif tipo == "dispercion":
            fig.add_trace(
                go.Scatter(
                    x=list(range(len(datos))),
                    y=datos,
                    mode="markers",
                    name="Serie única",
                )
            )
        else:
            print("Tipo de gráfico no soportado.")
            return
    elif isinstance(datos, dict):
        fig = go.Figure()
        for label, serie in datos.items():
            if tipo == "linea":
                fig.add_trace(
                    go.Scatter(
                        x=list(range(len(serie))), y=serie, mode="lines", name=label
                    )
                )
            elif tipo == "barra":
                fig.add_trace(go.Bar(x=list(range(len(serie))), y=serie, name=label))
            elif tipo == "dispercion":
                fig.add_trace(
                    go.Scatter(
                        x=list(range(len(serie))), y=serie, mode="markers", name=label
                    )
                )
            else:
                print("Tipo de gráfico no soportado.")
                return

    fig.update_layout(
        title=f"Gráfico de {tipo.capitalize()}",
        xaxis_title="Índice",
        yaxis_title="Valor",
        template="plotly_dark",
    )
    fig.show()
