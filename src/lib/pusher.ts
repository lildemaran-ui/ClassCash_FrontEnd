import Pusher from 'pusher-js'

export const pusherClient = new Pusher('e380a7838f2ebba71929', {
  cluster: 'sa1',
  forceTLS: true,
})
