/* @ts-nocheck */
// @ts-expect-error - @rails/actioncable lacks TypeScript definitions but is required for WebSocket communication
import { Subscription } from '@rails/actioncable';

interface UserUpdatesSubscription extends Subscription {
  received: (data: {
    type: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      date_of_birth: string;
      synced_at?: string;
      [key: string]: unknown;
    };
  }) => void;
}

let consumer;
let userUpdatesSubscription: UserUpdatesSubscription;

if (typeof window !== 'undefined') {
  /* @ts-nocheck */
  // @ts-expect-error Type error: Could not find a declaration file for module '@rails/actioncable'.
  import('@rails/actioncable').then(({ createConsumer }) => {
    const wsUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const wsEndpoint = `${wsUrl}/cable`;
    
    // Properly handle both http→ws and https→wss conversions
    const wsProtocol = wsEndpoint.startsWith('https') ? 'wss' : 'ws';
    const websocketUrl = wsEndpoint.replace(/^http(s)?:\/\//, `${wsProtocol}://`);
    
    consumer = createConsumer(websocketUrl);

    userUpdatesSubscription = consumer.subscriptions.create('UserUpdatesChannel', {
      connected() {
        console.log('Connected to UserUpdates channel');
      },

      disconnected() {
        console.log('Disconnected from UserUpdates channel');
      },

      received(data: {
        type: string;
        user: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          date_of_birth: string;
          synced_at?: string;
          [key: string]: unknown;
        };
      }) {
        console.log('ActionCable Received data:', {
          type: data.type,
          payload: data,
          timestamp: new Date().toISOString()
        });
      }
    }) as UserUpdatesSubscription;
  });
}

export { consumer as default, userUpdatesSubscription };