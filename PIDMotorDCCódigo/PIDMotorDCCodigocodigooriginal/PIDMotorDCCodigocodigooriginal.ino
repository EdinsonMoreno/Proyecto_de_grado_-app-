#include <PID_v1_bc.h>
// ********************************************** I/O **********************************************************************
const byte    encA = 2;              // Entrada de la señal A del encoder.
const byte    encB = 3;              // Entrada de la señal B del encoder.
const byte    PWMA = 5;              // Salida PWM a la primera patilla del motor a través de un puente H.
const byte    PWMB = 6;              // Salida PWM a la segunda patilla del motor a través de un puente H.
const byte    stepPinRot = 7;  // Pin de paso para el motor de rotación
const byte    dirPinRot = 8;   // Pin de dirección para el motor de rotación
const byte    stepPinElev = 9; // Pin de paso para el motor de elevación
const byte    dirPinElev = 10; // Pin de dirección para el motor de elevación
const byte    sensorPin = A0;  // Pin analógico para el sensor piranómetro

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
  
 // TCCR0B = TCCR0B & B11111000 | 1;  // Configuración de la frecuencia del PWM para los pines 5 y 6.
                                     // Podemos variar la frecuencia del PWM con un número de 1 (32KHz) hasta 7 (32Hz). El número que pongamos es un divisor de frecuencia. Min.=7, Max.=1. Está a la máxima frecuencia y es como mejor resultado me ha dado y además es silencioso.
  attachInterrupt(digitalPinToInterrupt(encA), encoder, CHANGE); // En cualquier flanco ascendente o descendente
  attachInterrupt(digitalPinToInterrupt(encB), encoder, CHANGE); // en los pines 2 y 3, actúa la interrupción.
  
  pinMode(stepPinRot, OUTPUT);
  pinMode(dirPinRot, OUTPUT);
  pinMode(stepPinElev, OUTPUT);
  pinMode(dirPinElev, OUTPUT);
  pinMode(sensorPin, INPUT);
  
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
  // Leer valor del sensor piranómetro
  int sensorValue = analogRead(sensorPin);
  
  // Conversión grados-pulsos para PID
  Setpoint = Grados * 3.7111111111111111111111111111111111111;
  Respuesta = contador / 3.711111111111111111111111111111111111;
  
  Input = (double)contador;
  
  while(!myPID.Compute());

  // Control del Motor DC con PID
  if (((long)Setpoint - contador) == 0) {
    digitalWrite(PWMA, LOW);
    digitalWrite(PWMB, LOW); 
    digitalWrite(ledok, HIGH);
  }
  else {
    if (Output > 0.0) {
      digitalWrite(PWMB, LOW);
      analogWrite(PWMA, abs(Output));
    }
    else {
      digitalWrite(PWMA, LOW);
      analogWrite(PWMB, abs(Output));
    }
  }
  
  // Procesamiento de comandos seriales
  if (Serial.available() > 0) {
    cmd = 0;
    cmd = Serial.read();
    if (cmd > 31) {
      byte flags = 0;
      if (cmd > 'Z') cmd -= 32;
      
      switch(cmd) {
        case 'P': kp = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break;
        case 'I': ki = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break;
        case 'D': kd = Serial.parseFloat(); myPID.SetTunings(kp, ki, kd); flags = 1; break;
        case 'T': tmp = Serial.parseInt(); myPID.SetSampleTime(tmp); flags = 1; break;
        case 'G': Grados = Serial.parseFloat(); flags = 2; break;
        case 'K': flags = 3; break;
        case 'R': // Control motor de rotación
          int steps = Serial.parseInt();
          int dir = steps > 0 ? HIGH : LOW;
          controlMotor(stepPinRot, dirPinRot, abs(steps), dir);
          break;
        case 'E': // Control motor de elevación
          steps = Serial.parseInt();
          dir = steps > 0 ? HIGH : LOW;
          controlMotor(stepPinElev, dirPinElev, abs(steps), dir);
          break;
      }
      digitalWrite(ledok, LOW);
      
      imprimir(flags);
    }
  }

  // Enviar datos por serial
  Serial.print(Grados);
  Serial.print(" ");
  Serial.print(Respuesta);
  Serial.print(" ");
  Serial.println(sensorValue);
}
// Encoder x4. Cuando se produzca cualquier cambio en el encoder esta parte hará que incremente o decremente el contador.
void encoder()    
{
  ant = act;    // Guardamos el valor 'act' en 'ant' para convertirlo en pasado.
  act = PIND & 12;    // Guardamos en 'act' el valor que hay en ese instante en el encoder y hacemos un
  // enmascaramiento para aislar los dos únicos bits que utilizamos para esta finalidad.
  if (ant == 12 && act == 4) contador++; // Incrementa el contador si el encoder se mueve hacia delante.
  if (ant == 4 && act == 0) contador++;
  if (ant == 0 && act == 8) contador++;
  if (ant == 8 && act == 12) contador++;
  
  if (ant == 4 && act == 12) contador--; // Decrementa el contador si el encoder se mueve hacia atrás.
  if (ant == 0 && act == 4) contador--;
  if (ant == 8 && act == 0) contador--;
  if (ant == 12 && act == 8) contador--;
}

void controlMotor(byte stepPin, byte dirPin, int steps, int direction)
{
  digitalWrite(dirPin, direction);
  for (int i = 0; i < steps; i++)
  {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(1000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(1000);
  }
}

void imprimir(byte flag) // Imprime en el terminal serie los datos de las contantes PID, tiempo de muestreo y posición. En los demás casos sólo imprime la posición del motor.
{
  if ((flag == 1) || (flag == 3))
  {
    Serial.print("KP=");    Serial.print(kp);
    Serial.print(" KI=");    Serial.print(ki);
    Serial.print(" KD=");    Serial.print(kd);
    Serial.print(" Time=");  Serial.println(tmp);
  }
}
