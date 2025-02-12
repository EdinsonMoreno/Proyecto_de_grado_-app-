#include <PID_v1.h>    // Librería PID de Brett Beauregard: https://playground.arduino.cc/Code/PIDLibrary

// ********************************************** I/O **********************************************************************
const byte    encA = 2;              // Entrada de la señal A del encoder.
const byte    encB = 3;              // Entrada de la señal B del encoder.
const byte    PWMA = 5;              // Salida PWM a la primera patilla del motor a través de un puente H.
const byte    PWMB = 6;              // Salida PWM a la segunda patilla del motor a través de un puente H.
// ************************************************ Variables PID *****************************************************************
double        Setpoint = 0.0, Input = 0.0, Output = 0.0;  // Setpoint=Posición designada; Input=Posición del motor; Output=Tensión de salida para el motor.
double        kp = 0.0, ki = 0.0, kd = 0.0;               // Constante proporcional, integral y derivativa.
double        outMax = 0.0, outMin = 0.0;                 // Límites para no sobrepasar la resolución del PWM.
double        Grados=0.0, Respuesta=0.0;
// **************************************************** Otras Variables ***********************************************************
volatile long contador = 0;           // En esta variable se guardará los pulsos del encoder y que interpreremos como ángulo
byte          ant = 0, act = 0;       // Sólo se utiliza los dos primeros bits de estas variables y servirán para decodificar el encoder. (ant=anterior, act=actual.)
byte          cmd = 0;                // Un byte que utilizamos para la comunicación serie. (cmd=comando.)
unsigned int  tmp = 0;                // Variable que utilizaremos para poner el tiempo de muestreo.
const byte    ledok = 13;             // El pin 13 de los Arduinos tienen un led que utilizo para mostrar que el motor ya ha llegado a la posición designada.
// ********************************************************************************************************************************

PID myPID(&Input, &Output, &Setpoint, 0.0, 0.0, 0.0, DIRECT); // Parámetros y configuración para invocar la librería.

void setup()                          // Configuramos los pines de entrada/salida y configuramos el terminal serie.
{
  Serial.begin(115200);               // Configura la velocidad en baudios del terminal serie.
  pinMode(PWMA, OUTPUT);              // Declara las dos salidas PWM para el control del motor (pin 5).
  pinMode(PWMB, OUTPUT);              //                                                       (pin 6).
  digitalWrite(PWMA, LOW);            // Y ambas salidas las inicializa a cero.
  digitalWrite(PWMB, LOW);
  
  TCCR0B = TCCR0B & B11111000 | 1;  // Configuración de la frecuencia del PWM para los pines 5 y 6.
                                     // Podemos variar la frecuencia del PWM con un número de 1 (32KHz) hasta 7 (32Hz). El número que pongamos es un divisor de frecuencia. Min.=7, Max.=1. Está a la máxima frecuencia y es como mejor resultado me ha dado y además es silencioso.
  attachInterrupt(digitalPinToInterrupt(encA), encoder, CHANGE); // En cualquier flanco ascendente o descendente
  attachInterrupt(digitalPinToInterrupt(encB), encoder, CHANGE); // en los pines 2 y 3, actúa la interrupción.
  
  outMax =  255.0;                    // Límite máximo del PWM.
  outMin = -outMax;                   // Límite mínimo del PWM.
  
  tmp = 25;                           // Tiempo de muestreo en milisegundos.
  
  kp = 2.701;                          // Constantes PID iniciales. Los valores son los adecuados para un encoder de 334 ppr,
  ki = 9.324;                          // pero como el lector de encoder está diseñado como x4 equivale a uno de 1336 ppr. (ppr = pulsos por revolución.)   
  kd = 0.1956;
  
  myPID.SetSampleTime(tmp);             // Envía a la librería el tiempo de muestreo.
  myPID.SetOutputLimits(outMin, outMax);// Límites máximo y mínimo; corresponde a Max.: 0=0V hasta 255=5V (PWMA), y Min.: 0=0V hasta -255=5V (PWMB). Ambos PWM se convertirán a la salida en valores absolutos, nunca negativos.
  myPID.SetTunings(kp, ki, kd);         // Constantes de sintonización.
  myPID.SetMode(AUTOMATIC);             // Habilita el control PID (por defecto).
  Setpoint = (double)contador;          // Para evitar que haga cosas extrañas al inciarse, igualamos los dos valores para que comience estando el motor parado.
  
  imprimir(3);                        // Muestra los datos de sintonización y el tiempo de muestreo por el terminal serie.
}

void loop()
{
  
//El valor de 3.711111111 sale entre la razón de 1336 pulsos y 360 grados, como una vuelta completa en el motor son 1336 pulsos del encoder,entonces en grados son 360
//Y como el sistema funciona con base en los pulsos, por ejemplo, el calculo del error se realiza entre los pulsos requeridos por el setpoint menos los pulsos contados 
//Se hace la divición de 1336/360 que da igual a 3.711111, entonces cuando se ingrese en el setpoint una posición en grados por ejemplo 180° este valor en el programa
//se mulriplicará por 3.7111 para que puede hacer el calculo del error en pulsos.
 
 Setpoint=Grados*3.7111111111111111111111111111111111111; //Es para ingresar valores de 0 a 360 grados como setpoint, asi cuando se le ingrese un valor a la variable grados desde el serialploter, el valor introducido se multiplicara por 3.71111 y hara la conversion de grados a pulsos que es lo que lee la variable contador para hacer el calculo del error.
 Respuesta=contador/3.711111111111111111111111111111111111; //En este caso el contador que seria la respuestas en forma de pulsos, sera divida por 3.71111, para que en la grafica de respuesta muestre grados en lugar de pulsos.
  
  Input = (double)contador;           // Lectura del encoder óptico. El valor del contador se incrementa/decrementa a través de las interrupciones externas (pines 2 y 3).
  
  while(!myPID.Compute());            // Mientras no se cumpla el tiempo de muestreo, se queda en este bucle.

  // *********************************************** Control del Motor *************************************************
  if (((long)Setpoint - contador) == 0)// Cuando está en el punto designado, parar el motor.
  {
    digitalWrite(PWMA, LOW);          // Pone a 0 los dos pines del puente en H.
    digitalWrite(PWMB, LOW);
    digitalWrite(ledok, HIGH);        // Se enciende el led (pin 13) para avisar visualmente que está en la posición designada.
  }
  else                                // En caso contrario hemos de ver si el motor ha de ir hacia delante o hacia atrás. Esto lo determina el signo de la variable "Output".
  {
    if (Output > 0.0)                 // Mueve el motor hacia delante con el PWM correspondiente a su posición.
    {
      digitalWrite(PWMB, LOW);        // Pone a 0 el segundo pin del puente en H.
      analogWrite(PWMA, abs(Output)); // Por el primer pin sale la señal PWM.
    }
    else                              // Mueve el motor hacia  atrás   con el PWM correspondiente a su posición.
    {
      digitalWrite(PWMA, LOW);        // Pone a 0 el primer pin del puente en H.
      analogWrite(PWMB, abs(Output)); // Por el segundo pin sale la señal PWM.
    }
  }
  
  // Recepción de datos para posicionar el motor, o modificar las constantes PID, o el tiempo de muestreo. Admite posiciones relativas y absolutas.
  if (Serial.available() > 0)           // Comprueba si ha recibido algún dato por el terminal serie.
  {
    cmd = 0;                            // Por seguridad "limpiamos" cmd.
    cmd = Serial.read();                // "cmd" guarda el byte recibido.
    if (cmd > 31)
    {
      byte flags = 0;                                     // Borramos la bandera que decide lo que hay que imprimir.
      if (cmd >  'Z') cmd -= 32;                          // Si una letra entra en minúscula la covierte en mayúscula.
      
      // Decodificador para modificar las constantes PID.
      switch(cmd)                                                                            // Si ponemos en el terminal serie, por ejemplo "p2.5 i0.5 d40" y pulsas enter  tomará esos valores y los cargará en kp, ki y kd.
      {                                                                                      // También se puede poner individualmente, por ejemplo "p5.5", sólo cambiará el parámetro kp, los mismo si son de dos en dos.
        case 'P': kp  = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break; // Carga las constantes y presenta en el terminal serie los valores de las variables que hayan sido modificadas.
        case 'I': ki  = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break;
        case 'D': kd  = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break;
        case 'T': tmp = Serial.parseInt();   myPID.SetSampleTime(tmp);     flags = 1; break;
        case 'G': Grados = Serial.parseFloat();                            flags = 2; break;  // Esta línea permite introducir una posición absoluta. Ex: g180 (y luego enter) e irá a esa posición.
        case 'K':                                                          flags = 3; break;  // Se puede introducir la letra k para poder observar en el serialploter los parametros de las constantes anteriores
      }
      digitalWrite(ledok, LOW);       // Cuando entra una posición nueva se apaga el led y no se volverá a encender hasta que el motor llegue a la posición que le hayamos designado.
      
      imprimir(flags); 
    }
  }
Serial.print(Grados);
Serial.print(" ");
Serial.println(Respuesta);

}
// Encoder x4. Cuando se produzca cualquier cambio en el encoder esta parte hará que incremente o decremente el contador.
void encoder()                        
{
    ant=act;                          // Guardamos el valor 'act' en 'ant' para convertirlo en pasado.
    act=PIND & 12;                    // Guardamos en 'act' el valor que hay en ese instante en el encoder y hacemos un
                                      // enmascaramiento para aislar los dos únicos bits que utilizamos para esta finalidad.
    if(ant==12 && act==4)  contador++;// Incrementa el contador si el encoder se mueve hacia delante.
    if(ant==4  && act==0)  contador++;
    if(ant==0  && act==8)  contador++;
    if(ant==8  && act==12) contador++;
    
    if(ant==4  && act==12) contador--;// Decrementa el contador si el encoder se mueve hacia atrás.
    if(ant==0  && act==4)  contador--;
    if(ant==8  && act==0)  contador--;
    if(ant==12 && act==8)  contador--;
}

void imprimir(byte flag) // Imprime en el terminal serie los datos de las contantes PID, tiempo de muestreo y posición. En los demás casos sólo imprime la posición del motor.
{
  if ((flag == 1) || (flag == 3))
  {
    Serial.print("KP=");     Serial.print(kp);
    Serial.print(" KI=");    Serial.print(ki);
    Serial.print(" KD=");    Serial.print(kd);
    Serial.print(" Time=");  Serial.println(tmp);
  }
}
