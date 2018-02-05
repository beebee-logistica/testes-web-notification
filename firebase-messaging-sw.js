// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '765081251786'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        data: Object.assign({}, payload.data),
        tag: payload.data.notId,
        body: payload.data.message,
        icon: 'https://static.wixstatic.com/media/ce3118_d14b0993f9784b898868a00195eb7964~mv2.jpg/v1/fill/w_92,h_75,al_c,q_80,usm_0.66_1.00_0.01/ce3118_d14b0993f9784b898868a00195eb7964~mv2.webp'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event);
    event.notification.close();

    // Client.focus();

    // // This looks to see if the current is already open and
    // // focuses if it is
    // event.waitUntil(clients.matchAll().then(function (clientList) {
    //     for (var i = 0; i < clientList.length; i++) {
    //         console.log(client.url);
    //         var client = clientList[i];
    //         if (client.url == '/#' && 'focus' in client)
    //             return client.focus();
    //     }
    // }));
});
