// Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here, other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');

// // Initialize the Firebase app in the service worker by passing in the
// // messagingSenderId.
// firebase.initializeApp({
//     'messagingSenderId': '765081251786'
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();

    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
});

self.addEventListener('push', function (event) {
    if (event.data) {
        const payload = event.data.json();

        const promiseChain = Promise.all([sendBackgroundInfo(payload.data), sendNotification(payload)]);

        event.waitUntil(promiseChain);
    } else {
        console.log('This push event has no data.');
    }
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();
    event.waitUntil(sendClickToClient(event));
});

const sendBackgroundInfo = (data) => {
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {

            return Promise.all(
                windowClients.map(client => {
                    return client.postMessage({
                        type: 'notification', // TEM QUE BATER COM A RECEPÇÃO NO CLIENT, CRIAR CONST
                        additionalData: data
                    });
                })
            );

            // for (let i = 0; i < windowClients.length; i++) {
            //     const windowClient = windowClients[i];
            //     windowClient.postMessage({
            //         type: 'notificationBackground', // TEM QUE BATER COM A RECEPÇÃO NO CLIENT
            //         additionalData: data
            //     });
            // }
        });
};

const sendNotification = (payload) => {
    if (payload.data.message || payload.data.title) {

        // Customize notification here
        const notificationTitle = payload.data.title || '';
        const notificationOptions = {
            data: Object.assign({}, payload.data),
            tag: payload.data.notId,
            body: payload.data.message || '',
            icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png'
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    }
}

const sendClickToClient = (event) => {

    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            const focusedClient = windowClients.find(client => client.focused);

            if (!focusedClient) {
                const visibleClient = windowClients.find(client => client.visibilityState === 'visible');
                return visibleClient ? visibleClient.focus() : windowClients[0].focus();
            }

            return focusedClient;
        })
        .then((client) => {
            return client.postMessage({
                type: 'notificationClick', // TEM QUE BATER COM A RECEPÇÃO NO CLIENT, CRIAR CONST
                additionalData: event.notification.data
            })
        })
        .catch(console.error);
}

// function isClientFocused() {
//     return clients.matchAll({
//         type: 'window',
//         includeUncontrolled: true
//     })
//         .then((windowClients) => {
//             return windowClients.some(client => client.focused);

//             // return windowClients.some(client => client.visibilityState === 'visible');

//             // let clientIsFocused = false;

//             // for (let i = 0; i < windowClients.length; i++) {
//             //     const windowClient = windowClients[i];
//             //     if (windowClient.focused) {
//             //         clientIsFocused = true;
//             //         break;
//             //     }
//             // }

//             // return clientIsFocused;
//         });
// }

// messaging.setBackgroundMessageHandler(function (payload) {

//     console.log('recebeu mensagem em background.');
//     // Envia os dados para todos os clients abertos
//     sendBackgroundInfo(payload.data);

//     if (payload.data.message || payload.data.title) {
//         // Customize notification here
//         const notificationTitle = payload.data.title || '';
//         const notificationOptions = {
//             data: Object.assign({}, payload.data),
//             tag: payload.data.notId,
//             body: payload.data.message || '',
//             icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png'
//         };

//         return self.registration.showNotification(notificationTitle, notificationOptions);
//     }
// });
