# modulos/calculo.py
import pandas as pd
import numpy as np
import sympy as sp


def realizar_calculo(tipo_calculo, valores):
    """
    Realiza un cálculo dependiendo del tipo especificado.
    """
    if tipo_calculo == "suma":
        return suma(valores)
    elif tipo_calculo == "resta":
        return resta(valores)
    elif tipo_calculo == "multiplicacion":
        return multiplicacion(valores)
    elif tipo_calculo == "division":
        return division(valores)
    elif tipo_calculo == "derivada":
        return derivada(valores)
    elif tipo_calculo == "integral":
        return integral(valores)
    elif tipo_calculo == "sumar_si":
        return sumar_si(valores)
    elif tipo_calculo == "bdcontara":
        return bdcontara(valores)
    elif tipo_calculo == "bdextraer":
        return bdextraer(valores)
    elif tipo_calculo == "bdmax":
        return bdmax(valores)
    elif tipo_calculo == "bdmin":
        return bdmin(valores)
    else:
        return "Tipo de cálculo no soportado."


# Operaciones básicas
def suma(valores):
    """
    Realiza la suma de una lista de valores.
    """
    return sum(valores)


def resta(valores):
    """
    Realiza la resta de los valores de la lista.
    """
    return valores[0] - sum(valores[1:])


def multiplicacion(valores):
    """
    Realiza la multiplicación de una lista de valores.
    """
    resultado = 1
    for valor in valores:
        resultado *= valor
    return resultado


def division(valores):
    """
    Realiza la división de los valores de la lista.
    """
    try:
        resultado = valores[0]
        for valor in valores[1:]:
            resultado /= valor
        return resultado
    except ZeroDivisionError:
        return "Error: División por cero."


# Operaciones avanzadas (derivadas e integrales)
def derivada(valores):
    """
    Calcula la derivada de una expresión simbólica.
    """
    expr = sp.sympify(valores[0])  # Convertimos la expresión a una fórmula simbólica
    variable = sp.symbols("x")  # Definimos la variable x
    derivada = sp.diff(expr, variable)  # Calculamos la derivada
    return derivada


def integral(valores):
    """
    Calcula la integral de una expresión simbólica.
    """
    expr = sp.sympify(valores[0])  # Convertimos la expresión a una fórmula simbólica
    variable = sp.symbols("x")  # Definimos la variable x
    integral = sp.integrate(expr, variable)  # Calculamos la integral
    return integral


# Funciones tipo Excel (trabajo con bases de datos)
def sumar_si(valores):
    """
    Suma los valores de un rango que cumplan con un criterio específico.
    Ejemplo: SUMAR.SI(A1:A100, ">100")
    """
    rango, criterio = valores[0], valores[1]
    datos = pd.Series(rango)  # Convertimos el rango en una Serie de pandas
    return datos[datos > criterio].sum()


def bdcontara(valores):
    """
    Cuenta el número de celdas no vacías en una base de datos.
    """
    datos = pd.Series(valores)
    return datos.count()


def bdextraer(valores):
    """
    Extrae un único registro de una base de datos que cumple con los criterios.
    """
    datos, criterio_columna, criterio_valor = valores
    datos_df = pd.DataFrame(datos)
    return datos_df[datos_df[criterio_columna] == criterio_valor].iloc[0]


def bdmax(valores):
    """
    Devuelve el valor máximo de las entradas seleccionadas de la base de datos.
    """
    datos = pd.Series(valores)
    return datos.max()


def bdmin(valores):
    """
    Devuelve el valor mínimo de las entradas seleccionadas de la base de datos.
    """
    datos = pd.Series(valores)
    return datos.min()
