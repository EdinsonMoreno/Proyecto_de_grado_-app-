import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd


# Función para abrir el archivo de Excel
def abrir_archivo():
    archivo = filedialog.askopenfilename(filetypes=[("Archivos de Excel", "*.xlsx")])
    if archivo:
        df = pd.read_excel(archivo)
        mostrar_datos(df)


# Función para mostrar los datos de Excel en la interfaz
def mostrar_datos(df):
    for widget in frame_datos.winfo_children():
        widget.destroy()  # Limpiar los widgets anteriores
    for i, col in enumerate(df.columns):
        label_columna = tk.Label(
            frame_datos, text=col, width=15, anchor="w", bg="lightgray"
        )
        label_columna.grid(row=0, column=i)
    for i, row in df.iterrows():
        for j, val in enumerate(row):
            label_valor = tk.Label(
                frame_datos, text=val, width=15, anchor="w", bg="white"
            )
            label_valor.grid(row=i + 1, column=j)


# Función de ejemplo para un módulo adicional
def ejecutar_modulo():
    messagebox.showinfo("Módulo", "Ejecutando módulo...")


# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Interfaz Gráfica para Módulos")
ventana.geometry("800x600")

# Frame para los botones de acción
frame_acciones = tk.Frame(ventana, bg="lightblue")
frame_acciones.pack(fill="x")

# Botones para interactuar con los módulos
boton_abrir = tk.Button(frame_acciones, text="Abrir Archivo", command=abrir_archivo)
boton_abrir.pack(side="left", padx=10, pady=10)

boton_modulo = tk.Button(
    frame_acciones, text="Ejecutar Módulo", command=ejecutar_modulo
)
boton_modulo.pack(side="left", padx=10, pady=10)

# Frame para mostrar los datos del archivo de Excel
frame_datos = tk.Frame(ventana)
frame_datos.pack(pady=20)

# Frame para los menús y listas desplegables
frame_configuracion = tk.Frame(ventana)
frame_configuracion.pack(fill="x")

# Menú desplegable de selección
opciones = ["Opción 1", "Opción 2", "Opción 3"]
menu_desplegable = tk.OptionMenu(frame_configuracion, tk.StringVar(), *opciones)
menu_desplegable.pack(side="left", padx=10, pady=10)

# Lista de selección múltiple
lista_seleccion = tk.Listbox(frame_configuracion, selectmode="multiple", height=4)
for opcion in opciones:
    lista_seleccion.insert(tk.END, opcion)
lista_seleccion.pack(side="left", padx=10, pady=10)

# Iniciar la interfaz
ventana.mainloop()
