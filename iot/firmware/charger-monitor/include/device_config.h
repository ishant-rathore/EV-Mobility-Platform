#pragma once

#if __has_include("config.h")
#include "config.h"
#else
#include "config.example.h"
#endif

#ifndef MQTT_USERNAME
#define MQTT_USERNAME ""
#endif

#ifndef MQTT_PASSWORD
#define MQTT_PASSWORD ""
#endif

