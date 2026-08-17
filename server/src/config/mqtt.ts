import mqtt, { MqttClient } from 'mqtt';
import { config } from './index';
import { logger } from '../utils/logger';

let mqttClient: MqttClient | null = null;

/**
 * Initialize and return the MQTT client singleton.
 * Topic structure: paypark/{siteId}/{bayId}/{command|status|occupancy|heartbeat}
 */
export function getMqttClient(): MqttClient {
  if (mqttClient) return mqttClient;

  const options: mqtt.IClientOptions = {
    clientId: `paypark-server-${Date.now()}`,
    clean: true,
    reconnectPeriod: 5000,
  };

  if (config.mqtt.username) {
    options.username = config.mqtt.username;
    options.password = config.mqtt.password;
  }

  mqttClient = mqtt.connect(config.mqtt.brokerUrl, options);

  mqttClient.on('connect', () => {
    logger.info(`MQTT connected to ${config.mqtt.brokerUrl}`);

    // Subscribe to all status, occupancy, and heartbeat topics
    const subscriptions = [
      `${config.mqtt.topicPrefix}/+/+/status`,
      `${config.mqtt.topicPrefix}/+/+/occupancy`,
      `${config.mqtt.topicPrefix}/+/+/heartbeat`,
    ];

    mqttClient!.subscribe(subscriptions, (err) => {
      if (err) {
        logger.error('MQTT subscription error:', err);
      } else {
        logger.info('MQTT subscribed to device topics');
      }
    });
  });

  mqttClient.on('error', (err) => {
    logger.error('MQTT error:', err);
  });

  mqttClient.on('reconnect', () => {
    logger.warn('MQTT reconnecting...');
  });

  mqttClient.on('offline', () => {
    logger.warn('MQTT client offline');
  });

  return mqttClient;
}

/**
 * Publish a command to a specific bay's device.
 */
export function publishCommand(siteId: string, bayId: string, payload: object): void {
  const client = getMqttClient();
  const topic = `${config.mqtt.topicPrefix}/${siteId}/${bayId}/command`;

  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      logger.error(`MQTT publish error to ${topic}:`, err);
    } else {
      logger.info(`MQTT command published to ${topic}`);
    }
  });
}

export default getMqttClient;
