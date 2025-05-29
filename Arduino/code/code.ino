#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "Galaxy S21 Ultra 5G"
#define WIFI_PASSWORD "20010516"

#define API_KEY "AIzaSyB8qDCohGD8lREkTLl8tmKJjRGdl535iWU"
#define DATABASE_URL "https://moisturetrack-d2615-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Sensor pins
#define SOIL_MOISTURE_PIN 34
#define DHT_PIN 4
#define ONE_WIRE_BUS 12
#define DHT_TYPE DHT11
#define LED_BUILTIN_PIN 2

// IR Sensor Pins
#define IR_SENSOR_1 32
#define IR_SENSOR_2 25
#define IR_SENSOR_3 27



DHT dht(DHT_PIN, DHT_TYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
LiquidCrystal_I2C lcd(0x27, 16, 2);


FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Sensor variables
int soilMoistureValue, soilMoisturePercent;
float dhtHumidity, dhtTemp, ds18b20Temp, heatIndex;

// LCD display 
enum DisplayState {
  SHOW_SOIL_MOISTURE,
  SHOW_DHT_HUMIDITY,
  SHOW_DHT_TEMP,
  SHOW_DS18B20_TEMP,
  SHOW_HEAT_INDEX
};
DisplayState currentState = SHOW_SOIL_MOISTURE;

bool ir1State = false;
bool ir2State = false;
bool ir3State = false;

// Timing
unsigned long lastUpdateTime = 0;
const int updateInterval = 5000;
unsigned long lastDisplayChange = 0;
const int displayChangeInterval = 2000;

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN_PIN, OUTPUT);

  dht.begin();
  ds18b20.begin();
  lcd.init();
  lcd.backlight();
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lcd.print("Connecting WiFi");
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  lcd.clear();
  lcd.print("WiFi Connected");
  Serial.println("\nWiFi Connected");
  
  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = "test@email.com";
  auth.user.password = "123456";

  // Connect to Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

   // Initialize pins
  pinMode(IR_SENSOR_1, INPUT);
  pinMode(IR_SENSOR_2, INPUT);
  pinMode(IR_SENSOR_3, INPUT);

}

void loop() {
  unsigned long currentTime = millis();
  
  // Update sensors and send to Firebase
  if (currentTime - lastUpdateTime >= updateInterval) {
    readSensors();
    readIrSensor();
    if (Firebase.ready()) {
      sendToFirebase();
      getFirebaseData();
    }
    lastUpdateTime = currentTime;
  }
  

  if (currentTime - lastDisplayChange >= displayChangeInterval) {
    updateDisplay();
    lastDisplayChange = currentTime;
  }
}
void getFirebaseData(){
  if (Firebase.RTDB.getInt(&fbdo, "/led")) {
    int ledState = fbdo.intData();

    if (ledState == 1) {
      lcd.clear();
      lcd.print("Alarm");
      digitalWrite(LED_BUILTIN_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN_PIN, LOW);
      delay(500);
    } else {
      digitalWrite(LED_BUILTIN_PIN, LOW);
    }

    Serial.print("LED State: ");
    Serial.println(ledState);
  } 
  else if (Firebase.RTDB.getInt(&fbdo, "/maxTemperature")) {
    int maxTemperature = fbdo.intData();

    if (maxTemperature < ds18b20Temp ) {
      lcd.clear();
      lcd.print("Alarm");
      digitalWrite(LED_BUILTIN_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN_PIN, LOW);
      delay(500);
    } else {
      digitalWrite(LED_BUILTIN_PIN, LOW);
    }
  }
  else if (Firebase.RTDB.getInt(&fbdo, "/minSoilMoisture")) {
    int minSoilMoisture = fbdo.intData();

 
    if (minSoilMoisture > soilMoisturePercent ) {
      lcd.clear();
      lcd.print("Alarm");
      digitalWrite(LED_BUILTIN_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN_PIN, LOW);
      delay(500);
    } else {
      digitalWrite(LED_BUILTIN_PIN, LOW);
    }
  }
   if (Firebase.RTDB.getInt(&fbdo, "/minTemperature")) {
    int minTemperature = fbdo.intData();

   
    if (minTemperature > ds18b20Temp ) {
      lcd.clear();
      lcd.print("Alarm");
      digitalWrite(LED_BUILTIN_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN_PIN, LOW);
      delay(500);
    } else {
      digitalWrite(LED_BUILTIN_PIN, LOW);
    }
  }
   if (Firebase.RTDB.getInt(&fbdo, "/maxSoilMoisture")) {
    int maxSoilMoisture = fbdo.intData();

 
    if (maxSoilMoisture < soilMoisturePercent ) {
      lcd.clear();
      lcd.print("Alarm");
      digitalWrite(LED_BUILTIN_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN_PIN, LOW);
      delay(500);
    } else {
      digitalWrite(LED_BUILTIN_PIN, LOW);
    }
  }
  else {
    Serial.print("Firebase error: ");
    Serial.println(fbdo.errorReason());
  }
}
void readSensors() {
  // Read all sensors
  soilMoistureValue = analogRead(SOIL_MOISTURE_PIN);
  soilMoisturePercent = map(soilMoistureValue, 4095, 1500, 0, 100);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);
  
  dhtHumidity = dht.readHumidity();
  dhtTemp = dht.readTemperature();
  
  ds18b20.requestTemperatures();
  ds18b20Temp = ds18b20.getTempCByIndex(0);
  
  heatIndex = dht.computeHeatIndex(dhtTemp, dhtHumidity, false);
  
  // Print to serial
  Serial.println("\nSensor Readings:");
  Serial.printf("Soil: %d%% (%d)\n", soilMoisturePercent, soilMoistureValue);
  Serial.printf("DHT - Hum: %.1f%%, Temp: %.1fC\n", dhtHumidity, dhtTemp);
  Serial.printf("DS18B20: %.1fC\n", ds18b20Temp);
  Serial.printf("Heat Index: %.1fC\n", heatIndex);
}

void sendToFirebase() {
  // Create JSON object for Realtime Database
  FirebaseJson json;
  
  json.set("soil_moisture/value", soilMoisturePercent);
  json.set("soil_moisture/raw", soilMoistureValue);
  json.set("dht/humidity", dhtHumidity);
  json.set("dht/temperature", dhtTemp);
  json.set("ds18b20/temperature", ds18b20Temp);
  json.set("heat_index", heatIndex);
  json.set("ir/ir1", ir1State);
  json.set("ir/ir2", ir2State);
  json.set("ir/ir3", ir3State);
  json.set("timestamp/.sv", "timestamp"); // Server timestamp
  
  // Send to Realtime Database
  if (Firebase.RTDB.setJSON(&fbdo, "/sensor_data/latest", &json)) {
    Serial.println("RTDB update success");
    //lcd.clear();
    //lcd.print("Data Uploaded!");
    //delay(1000);
  } else {
    Serial.println("RTDB error: " + fbdo.errorReason());
    lcd.clear();
    lcd.print("Upload Failed!");
    delay(1000);
  }
}

void updateDisplay() {
  lcd.clear();
  switch (currentState) {
    case SHOW_SOIL_MOISTURE:
      lcd.print("Soil Moisture:");
      lcd.setCursor(0, 1);
      lcd.printf("%d%% (%d)", soilMoisturePercent, soilMoistureValue);
      currentState = SHOW_DHT_HUMIDITY;
      break;
      
    case SHOW_DHT_HUMIDITY:
      lcd.print("Humidity:");
      lcd.setCursor(0, 1);
      lcd.printf("%.1f%%", dhtHumidity);
      currentState = SHOW_DHT_TEMP;
      break;
      
    case SHOW_DHT_TEMP:
      lcd.print("DHT Temp:");
      lcd.setCursor(0, 1);
      lcd.printf("%.1fC", dhtTemp);
      currentState = SHOW_DS18B20_TEMP;
      break;
      
    case SHOW_DS18B20_TEMP:
      lcd.print("DS18B20 Temp:");
      lcd.setCursor(0, 1);
      lcd.printf("%.1fC", ds18b20Temp);
      currentState = SHOW_HEAT_INDEX;
      break;
      
    case SHOW_HEAT_INDEX:
      lcd.print("Heat Index:");
      lcd.setCursor(0, 1);
      lcd.printf("%.1fC", heatIndex);
      currentState = SHOW_SOIL_MOISTURE;
      break;
      
  }
}
void readIrSensor(){
   ir1State = digitalRead(IR_SENSOR_1) == LOW;  // LOW when object detected
  ir2State = digitalRead(IR_SENSOR_2) == LOW;
  ir3State = digitalRead(IR_SENSOR_3) == LOW;

  // Print to serial monitor
  Serial.printf("IR States - 1: %s | 2: %s | 3: %s\n",
               ir1State ? "ACTIVE" : "INACTIVE",
               ir2State ? "ACTIVE" : "INACTIVE",
               ir3State ? "ACTIVE" : "INACTIVE");
}