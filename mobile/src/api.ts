import { Platform } from 'react-native';

// Android Emulator uses 10.0.2.2 to access the host machine.
// iOS Simulator and Web use localhost.
// If testing on a PHYSICAL device, replace this with your LAN IP (e.g., http://192.168.1.5:8000)
const BACKEND_API = Platform.OS === 'android' ? "http://10.0.2.2:8000" : "http://localhost:8000";

export default BACKEND_API;
