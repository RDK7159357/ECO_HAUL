import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const initializeTensorFlow = async () => {
  // Wait for tf to be ready
  await tf.ready();
  
  // Enable production mode for better performance
  tf.env().set('WEBGL_VERSION', 2);
  tf.env().set('WEBGL_CPU_FORWARD', false);
  
  console.log('TensorFlow.js initialized');
  console.log('Backend:', tf.getBackend());
  
  return true;
};
